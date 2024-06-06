import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {Event} from "../models/event.model.js";
import { Vendor } from "../models/vendor.model.js";

export const carryEvent= asyncHandler(async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('Unauthorized request');
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        if(!decodedToken){
            throw new Error('Invalid Access Token-in decodedToken');
        }

        const vendor = await Vendor.findById(decodedToken?._id).select('-password -refreshToken');
        const event = await Event.findById(decodedToken?._id).select('-password -refreshToken');
        if (!vendor) {
            throw new Error('Invalid Access Token');
        }
        req.vendor = vendor;
        req.event = event;
        
        next()
    } catch (error) {
        res.status(401).json({ message:error?.message ||  'Invalid Access in error Token' });
    }   
})  