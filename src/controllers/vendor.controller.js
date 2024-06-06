import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { Vendor } from "../models/vendor.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const generaAccessAndRefereshToken= async function (vendorId){
    try{  
       const vendor=await Vendor.findById(vendorId)
       //console.log(vendor,"this is vendor");
       const accessToken=vendor.generateAccessToken()
       if(!accessToken){
           throw new ApiError(500,"something went wrong while generating access token");
       }
       const refreshToken =vendor.generateRefreshToken()
       if(!refreshToken){
           throw new ApiError(500,"something went wrong while generating refresh token");
       }
        
       vendor.refreshToken=refreshToken;
       //vendor.accessToken=accessToken;
       await vendor.save({validateBeforeSave : false})
 
       return {accessToken,refreshToken}
    }catch(error){
       throw new ApiError(500,error)
    }
 }

//====================================================================================================================


const vendorRegister = asyncHandler( async (req, res)=>{
    // get vendor details from frontend
    //validate not empty
    //checkk vendor exist or not
    //file present or not
    ////upload them to cloudinary , avatar ,check on multer and cloudinary
    //create vendor object in db and save
    //remove password and refresh token from files response
    //check response and vendor account creation
    // returm response

   try {
     console.log("running");
     const {vendorName,companyName,email,phone,aadhaar,password,city} = req.body
     
 
     console.log(vendorName,companyName,email,phone,aadhaar,password,city);    
     if(
         [vendorName,companyName,email,phone,aadhaar,password,city].some((field)=>
             field.trim()==="")
     ){
         throw new ApiError(400,"All fields are required")
     }
 
     if(!email.includes('@') ){
         throw new ApiError(400,"@ required in email check email again")
     }
 
     if(phone.length!=10 ){
         throw new ApiError(400,"phone digit  should be 10 length")
     }
     //we have to some more validation here
     if(password.length<8){
         throw new ApiError(400,"password should be more then 8");
     }
 
     const existingvendor= await Vendor.findOne(
         {
             $or: [{vendorName},{email}]
         }
     )
 
     if(existingvendor){
         throw new ApiError(400,"vendor already exist with this credentials ")
     }
    //  if(!req.files?.avatar[0]){
    //      throw new ApiError(400,"here is the problem")
    //  }
    //  const avatarLocalPath= req.files?.avatar[0]?.path
     
 
    //   const avatar1 =await uploadOnCloudinary(avatarLocalPath)
 
      
 
 
     const vendor = await Vendor.create(
         {
             vendorName:vendorName.toLowerCase(),
             email,
             //avatar:avatar1.url,
             password,
             phone,
             aadhaar,
             companyName,
             city,
             
 
         }
     )
 
     const createVendor = await Vendor.findById(vendor._id).select(" -password -refreshToken")
 
     if(!createVendor){
         throw new ApiError(501,"something went wrong while registering vendor");
     }
 
     return res
     .status(200)
     .json(
         new ApiResponse(
             200,
             createVendor,
             "Vendor created successfully"
         )
     )
   } catch (error) {
    res.status(error?.statusCode || 500).json({
        message: error?.message || "Internal Server Error",
        });
   }
})

//====================================================================================================================

const loginVendor = asyncHandler( async (req,res) =>{
    //req body =data
    //vendorName email check
    //find vendor
    //if vendor find check password
    //access and refresh tokengenerate and send vendor
    //send cookie secure cookie

    try {
        const {email,password,userType}= req.body
        console.log(email,password)
        console.log(req.body);
        console.log(userType);
        if(!email && !password ){
            throw new ApiError(400," email or password is required");
        }
    
        const vendor = await Vendor.findOne({email:email})
            
        console.log(vendor);
        if(!vendor){
            throw new ApiError(400," vendor not found in DB")
        }
    
        const isPasswordValid = await vendor.isPasswordCorrect(password)
        if(!isPasswordValid){
            throw new ApiError(401,"Password is wrong");
        }
        const vendorId_=vendor?._id;
        console.log(vendorId_);
        const {accessToken,refreshToken} = await generaAccessAndRefereshToken(vendorId_);
        const ventoken=accessToken
        vendor.refreshToken=refreshToken
    
        const options={
            httpOnly:true,
            //secure:process.env.NODE_ENV=="production"?true:false, //by this you can modify only server can do
            expires:new Date(Date.now()+1000*60*60*24*30)
            
        }
    
        
        
        return res.status(200)
        .cookie("JWT",accessToken,options)
        .cookie("ref-JWT",refreshToken,options)
        .cookie("vendorId",vendorId_,options)
        .set('Authorization', `Bearer ${ventoken}`)
        .json(
            new ApiResponse(
                200,
                {
                    vendor:vendor,accessToken,refreshToken
                },
                "Vendor logged in succefully"
            )
        )
    } catch (error) {
        res.status(error?.statusCode || 500).json({
            message: error?.message || "Internal Server Error",
        });
    }
})

//====================================================================================================================

const logoutVendor = asyncHandler(async (req ,res) => {
    await Vendor.findByIdAndUpdate(
        req.vendor?._id,
        {
            $set:{
                refreshToken:undefined
            }
        }, 
        {
            new:true
        }
    )

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "vendor Logout successfully"
        )
    )
})


//====================================================================================================================

const refreshAccessToken = asyncHandler( async (req ,res) =>{
    //vendors refresh token we taking from cookies
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
 
    if(!incomingRefreshToken){
       throw new ApiError(401,"unauthorized request")
    }
 
    try {
       const decodedtoken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
       const vendor= await Vendor.findById(decodedtoken?._id)
    
       if(!vendor){
          throw new ApiError(401,"invalid refresh token")
       }
    
       if(incomingRefreshToken !== vendor?.refreshToken){
          throw new ApiError(401 ," refressh token is expired and use")
       }
    
       const options= {
          httpOnly:true,
          secure:true
       }
    
       const {accessToken,newrefreshToken}=await generaAccessAndRefereshToken(vendor._id)
    
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
 
//====================================================================================================================

const changeCurrentVendorPassword =asyncHandler(async (req, res) => {
    const {oldPassword,newPassword} =req.body
 
    const vendor = await Vendor.findById(req.vendor?._id)
 
    const isPasswordCorrect=await vendor.isPasswordCorrect(oldPassword)
 
    if(!isPasswordCorrect){
       throw new ApiError(400,"Invalid old password")
    }
 
    vendor.password=newPassword
 
    await vendor.save({validateBeforeSave:false})
 
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password change successfully"))
 })
 
//====================================================================================================================

const getCurrentVendor= asyncHandler( async (req,res)=>{

      
      const vendor =req?.vendor
      console.log(vendor);
      return res
      .status(200)
      .json(
         new ApiResponse(200,{vendor},"Vendor details")
      )
 })

 //====================================================================================================================

 const updateVendorAccountDetails= asyncHandler(async (req,res)=>{
    const {phone,aadhaar}=req.body
 
    console.log("vendorIS:::::",req.vendor?._id)
    const user= await Vendor.findByIdAndUpdate(
       req.vendor?._id,
       {
          $set:{
             aadhaar,
             phone,
          }
       },
       {new:true}
       ).select("-password")
 
       console.log("user:::::::::",user);
       return res
       .status(200)
       .json(
          new ApiResponse(200, user,"Account details update Successfully")
       )
 })
 
 //====================================================================================================================




export {
    vendorRegister,
    loginVendor,
    logoutVendor,
    refreshAccessToken,
    changeCurrentVendorPassword,
    getCurrentVendor,
    updateVendorAccountDetails

}