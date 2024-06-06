import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {Event} from "../models/event.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Vendor } from "../models/vendor.model.js";

//===============================================================================================
const addEvent= asyncHandler(async (req,res)=>{

    //get event details from front end
    //all feild required
    //which vendor is adding this event get vendor id 
    //file present ot not thumnails
    //upload them to cloudinary 
    //create event object - create entry in db
    //check response and event creation
    //return response
    console.log("we are in add event");
    
    // const vendorId=req.cookies?.vendorId ;
    // const accessToken=req.cookies?.accessToken ;
    // const refreshToken=req.cookies?.refreshToken ;
    
    
    console.log("this is req.vendor?._id",req.vendor?._id);

    if(!req.vendor?._id){
        throw new ApiError(401,"invalid vendor id")
    }
    
    console.log(req.body);
    const {eventName,thumbnail,description ,city} = req.body
    



    if(eventName===""){
        ApiError(400,"Event name is important to add");
    }
    if(description===""){
        ApiError(400,"description is important to add"); 
    }

    if(!city){
        ApiError(400,"city is important to add"); 
    }
    

    // if(!req.files){
    //     throw new ApiError(501,"req file is not present !");
    // }
    const avatarLocalPath= req.files?.thumbnail[0]?.path
    // if(!avatarLocalPath){
    //     throw new ApiError(400,"Avatar local file path is compulsory is compulsory");
    //  }

     const avatar = await uploadOnCloudinary(avatarLocalPath)
    //  console.log(avatar);
    //  if(!avatar){
    //     throw new ApiError(400,"Avatar link is not working")
    //  }

     const event= await Event.create({
        eventName,
        thumbnail:avatar?.url || "",
        description,
        owner:req.vendor?._id,
        city
        
     })

    
     return res.status(200)
     .json(
        new ApiResponse(200,event,"event created successfully")
     )
})

//=======================================================================================================

const getEvent= asyncHandler(async (req,res)=>{
  try {
    const vendorId=req.vendor?._id;
    console.log("this is vendorId in get event",vendorId);
    if(!vendorId){
        throw new ApiError(401,"invalid vendor id")
    }
    const event= await Event.find({owner:vendorId})
    console.log("this is event",event);
    return res.status(200).json(
      new ApiResponse(200,event,"event fetch successfully")
    )



  } catch (error) {
    res.status(error?.statusCode || 500).json({
      message: error?.message || "Internal Server Error",
        });
  }
    

})



 const deleteEvent= asyncHandler(async(req,res)=>{
    const eventId =req.params.eventId;
    if(!eventId){
      throw new ApiError(400,"Please provide event ID to delete.");
    }
    console.log("this is eventId",eventId);
    const event= await Event.findById(eventId);
    if(!event){
      throw new ApiError(404,"Event not found");
    }

    const deleteEventSuccessfully=await event.deleteOne();
    if(deleteEventSuccessfully){
      console.log("event deleted successfully");
    }
    return res.status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "event deleted successfully"
      )
    )
 })

export {
    addEvent,
    getEvent,
    deleteEvent,
    
}


