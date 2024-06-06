import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";            
import {Order} from "../models/order.model.js"
import {Package} from "../models/package.model.js"
import {Event} from "../models/event.model.js"
import {Vendor} from "../models/vendor.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {carryEvent} from "../middlewares/carryEvent.middleware.js"

//=======================================================================================================
//add order


const userOrder=asyncHandler(async(req,res)=>{
    const userId=req.user?._id

    console.log("this is order",userId);

    try {
        const orderlist=await Order.find({userId:userId})
        console.log("this is orderlist",orderlist);
        return res.status(200)
        .json(
            new ApiResponse(200,orderlist,"order list fetched successfully")
        )
        
    } catch (error) {
        console.log("this is error int getting orderlist of user in userOrder",error);
    }
})

const addOrder= asyncHandler(async (req,res)=>{
    
    const userId=req.user?._id
    console.log(userId);
    
    const {packageId,amount,description,eventDate,locations,vendorId,packageName}=req.body
    if(!userId){
        throw new ApiError('Invalid user id',400)
    }
    if(!packageId){
        throw new ApiError('Invalid package id',400)
    }
    const order=await Order.create({
        userId,
        packageId,
        vendorId,
        amount,
        description,
        eventDate,
        locations,
        packageName
    })
    if(!order){
        throw new ApiError('order not created',500);
    }

    return res.status(200)
    .json(
        new ApiResponse(200,order,"order created successfully")
    )
})

//=======================================================================================================
//get order
const getVendorOrder= asyncHandler(async (req,res)=>{
    const vendorId=req.params.vendorId
    console.log(":::::::::::",vendorId);

    if(!vendorId){
        throw new ApiError('Invalid order id',400)
    }
    console.log("this is order:::::::::::",vendorId);
    const order=await Order.find({vendorId:vendorId})
    if(!order){
        throw new ApiError('order not found',404)
    }
    return res.status(200)
    .json(
        new ApiResponse(200,order,"order fetched successfully")
    )
})

//=======================================================================================================
//update order
const updateOrderstatus= asyncHandler(async (req,res)=>{
    const orderId=req.params.orderId
    console.log("this is orderId::::::::::::::::::::::",orderId);
    if(!orderId ){   
        throw new ApiError('Invalid order id',400)
    }

    const {status}=req?.body
    if(!status ){
        throw new ApiError('Invalid status:',400)
    }
    
    
    const updatedorder= await Order.findByIdAndUpdate(orderId,{
        $set:{
            status:req.body.status,
        }
    })                          
    return res.status(200)
    .json(
        new ApiResponse(200,updatedorder,"order updated successfully")
    )           

})

const removeOrder= asyncHandler(async (req,res)=>{
    const orderId=req.params.orderId;
    if(!orderId){   
        throw new ApiError('Invalid order id',400)
    }
    const order=await Order.findById(orderId)
    if(!order){
        throw new ApiError('order not found',404)
    }
    const removeOrder=await Order.findByIdAndDelete(orderId)
    return res.status(200)
    .json(
        new ApiResponse(200,removeOrder,"order deleted successfully")
    )   
})



export {
    addOrder,
    getVendorOrder,
    updateOrderstatus,
    removeOrder ,
    userOrder
}