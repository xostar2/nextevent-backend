import {Admin} from '../models/admin.model.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';




 const loginAdmin = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    console.log("this is email and password",email,password);
    if (!email || !password) {
       return res.status(400).json({ message: 'Username and password are required' });
   }
   const user = await Admin.findOne({ email });
   if(!user){
      throw new ApiError(404,"user not found in DB")
   }    
   
   
   return res.status(200)
   .json(
      new ApiResponse(
         200,
         {
            user
         },
         "User logged in Successfully"
      )
   )
 })


export  {
    loginAdmin
}