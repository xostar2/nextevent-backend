import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from '../utils/ApiError.js'
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

//==============================================================
//this work we generally repeat thats why we are making a method for that so we can use it for future


const generaAccessAndRefereshToken= async function (userId){
   try{  
      const user=await User.findById(userId)
      const accessToken=user.generateAccessToken()
      const refreshToken =user.generateRefreshToken()

      user.refreshToken=refreshToken;
      await user.save({validateBeforeSave : false})

      return {accessToken,refreshToken}
   }catch(error){
      throw new ApiError(500,"something went wrong while generating refreshtoken and Accesstoken")
   }
}

//================================================================

const registerUser = asyncHandler(async (req,res)=>{
    //get user details from frontend
    //validation - not empty
    //check if user already exist:  username email
    //files present or not avatar images
    //upload them to cloudinary , avatar ,check on multer and cloudinary
    //create user object - create entry in db 
    //remove password and refreshtoken fiels from response
    //check response and user creation 
    //return response 
   try {
       const {username,email,phone,gender,password,DOB,address,aadhaar} = req.body
      
        console.log(req.body);
       if(
           [username,email,password,phone].some((field)=>
           field?.trim()=== "")
       ){
               throw new ApiError(400,"All fields are required")
       }
   
       if(phone.length!=10){
           throw new ApiError(400,"Phone no should be 10 Digit");
       }
       //we have to some more validation here
       if(password.length<8){
           throw new ApiError(400,"Password Size should more then 8");
       }
   
       const existingUser= await User.findOne(
           {
               $or:[ { username },{ email } ]
           }
        )
       
        if(existingUser){
           throw new ApiError(409,"user already exist with Email and username");
        }
      //   if(!req.files){
      //       throw new ApiError(400,"req.file is not define or missing")
      //   }
      //   const avatarLocalPath= req.files?.avatar[0]?.path
   
      //   if(!avatarLocalPath){
      //      throw new ApiError(400,"Avatar is compulsory");
      //   }
   
      //   const avatar =await uploadOnCloudinary(avatarLocalPath)
   
      //   if(!avatar){
      //      throw new ApiError(400,"Avatar link is not working")
      //   }
   
        const user = await User.create({
           username:username.toLowerCase(),
           address,
           aadhaar,
           email,
           DOB,
           password,
           gender,
           phone
   
        })
        const createdUser=await  User.findById(user._id).select(
           "-password -refreshToken"
        )
   
        if(!createdUser){
           throw new ApiError(500,"Something went wrong while registering a user");
        }
   
        return res.status(200).json(
           new ApiResponse(200,createdUser,"User register sucessfully")
        )
   
   } catch (error) {
      res.status(error?.statusCode || 500).json({
         message: error?.message || "Internal Server Error",
        });
   }
})

//================================================================

const loginUser = asyncHandler(async(req,res)=>{
   // req body ->data
   //username email check
   //find the user
   //if user find check password
   //access and refresh token generate and send to user
   //send cookie secure cookies

   try {
      const {email,password} = req.body
      console.log("this is",email);
      console.log("this is password",password);
      console.log(req.body);
      
      if (!email || !password) {
         return res.status(400).json({ message: 'Username and password are required' });
     }
      const user = await User.findOne({email:email})
         // {
         //    $or : [{username},{email}]
         // }
      //)
      
      if(!user){
         throw new ApiError(404,"UnAuthorized user :Please use valid email and password")
      }
   
      const ispasswordValid= await user.isPasswordCorrect (password)
   
      if(!ispasswordValid){
         throw new ApiError(400,"invalid user credentials");
      }
   
      const {accessToken,refreshToken}=await generaAccessAndRefereshToken(user?._id);
      //  console.log(accessToken);
      //  console.log(refreshToken);
   
      user.refreshToken=refreshToken;
      const token=accessToken
      const options={
         httpOnly:true,
         secure:true,//by this you can modify only server can do
      }
      return res.status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshtoken",refreshToken,options)
      .set('Authorization', `Bearer ${token}`)
      .json(
         new ApiResponse(
            200,
            {
               user,accessToken,refreshToken
            },
            "User logged in Successfully"
         )
      )
   
   } catch (error) {
      res.status(error?.statusCode || 500).json({
         message: error?.message || "Internal Server Error",
        });
   }
})

//==================================================================

const logoutUser = asyncHandler(async (req,res)=>{
      try{
   if(req.user?.refreshToken){
   await User.findByIdAndUpdate(
         req.user?._id,
         {
            $set:{
               refreshToken:undefined
            }
         },
         {
            new :true
         }
      )
   }
      const options={
         httpOnly:true,
         secure:true,
         sameSite:"strict"
      }
      res.clearCookie("accessToken",options)
      
      

      return res.status(200)
      .json(
         new ApiResponse(200,{},"User logout successfully")
      )
   }catch(error){
      console.log("this is error in logout user:",error.message);
      throw new ApiError(500,error.message)
   }
})

//==================================================================



const refreshAccessToken = asyncHandler( async (req ,res) =>{
   //users refresh token we taking from cookies
   const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
      throw new ApiError(401,"unauthorized request")
   }

   try {
      const decodedtoken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
      const user= await User.findById(decodedtoken?._id)
   
      if(!user){
         throw new ApiError(401,"invalid refresh token")
      }
   
      if(incomingRefreshToken !== user?.refreshToken){
         throw new ApiError(401 ," refressh token is expired and use")
      }
   
      const options= {
         httpOnly:true,
         secure:true
      }
   
      const {accessToken,newrefreshToken}=await generaAccessAndRefereshToken(user._id)
   
      return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",newrefreshToken,options)
      .json(
         new ApiResponse(
            200,
            {
               accessToken,
               refreshToken : newrefreshToken,
               
            },
            "Access token refreshed"
         )
      )
   
   
   } catch (error) {
      throw new ApiError(200,error)
   }
})

//====================================================================

const changeCurrentUserPassword =asyncHandler(async (req, res) => {
   const {oldPassword,newPassword} =req.body

   const user = await User.findById(req.user?._id)

   const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)

   if(!isPasswordCorrect){
      throw new ApiError(400,"Invalid old password")
   }

   user.password=newPassword

   await user.save({validateBeforeSave:false})

   return res
   .status(200)
   .json(new ApiResponse(200,{},"Password change successfully"))
})

//==================================================================

const getCurrentUser= asyncHandler( async (req,res)=>{
   console.log(req.user)
   return res
   .status(200)
   .json(
      new ApiResponse(200,req.user,"current user fetch successfully")
   )
})

//===============================================================


const updateUserAccountDetails= asyncHandler(async (req,res)=>{
   const {username,phone,email}=req.body

   if(!username || !phone || !email){
      throw new ApiError(400,"all fields are required")
   }
   const user=User.findByIdAndUpdate(
      req.user?._id,
      {
         $set:{
            username,
            phone,
         
         }
      },
      {new:true}
      ).select("-password")

      return res
      .status(200)
      .json(
         new ApiResponse(200, user,"Account details update Successfully")
      )
})


//=================================================================


const updateUserAvatar = asyncHandler(async (req,res)=>{

   const avatarLocalPath=req.file?.path
   if(!avatarLocalPath){
      throw new ApiError(400,"avatar file is missing")
   }
   const  avatar = await uploadOnCloudinary(avatarLocalPath)

   if(!avatar.url){
      throw new ApiError(400,"error wile uploding on avatar")
   }
   
   const user=await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set:{
            avatar:avatar.url
         }
      },
      {new:true}
      ).select("-password")

      return res
      .status(200)
      .json(
        new ApiResponse( 200,
         user,
         "Update User Avatar Successfully")
      )

})
//i have to delete the old image from cloudinary {TODO}

//================================================================



export {
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken,
   changeCurrentUserPassword,
   getCurrentUser,
   updateUserAccountDetails,
   updateUserAvatar
} 