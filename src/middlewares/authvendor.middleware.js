import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {Vendor} from "../models/vendor.model.js";

export const verifyJWT= asyncHandler(async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', "");
        //console.log("this is token we are in authvendor middleware:",token);
        if (!token) {
            throw new Error('Unauthorized request');
        }
        
        
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        //console.log("this is decodedToken heree:",decodedToken);
        if(!decodedToken){
            throw new Error('Invalid Access Token-in decodedToken');
        }
        
        const vendor = await Vendor.findById(decodedToken?._id).select('-password -refreshToken');
        
        if (!vendor) {
            throw new Error('Invalid Access Token');
        }

        req.vendor = vendor;
        console.log("we send the data of vendor as response")
        
        next()
    } catch (error) {
        console.log("yhi to error he bhai:",error.message)
        res.status(401).json(
            
         new ApiError(401,error.message)
        );
    }
})