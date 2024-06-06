import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {Package} from "../models/package.model.js"
import {uploadOnCloudinary} from "../utils/multiUploadCloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

//===============================================================================================
const addPackage= asyncHandler(async (req,res)=>{

    //get package details from front end
    //all feild required
    //which event is adding this package get event id 
    //file present ot not thumnails
    //upload them to cloudinary 
    //create package object - create entry in db
    //check response and package creation
    //return response


    

    console.log("enter kar liya ")
    // if(!eventId){
    //     throw new ApiError(401,"invalid event id")
    // }
    // if(!vendorId){
    //     throw new ApiError(401,"invalid vendor id")
    // }
    console.log(req.body);

    const {title,description,amount ,avatar,eventOwnerId,vendorOwnerId} = req.body
    console.log(title,description,amount)



    if(title===""){
        ApiError(400,"title is important to add");
    }
    if(description===""){
        ApiError(400,"description is important to add"); 
    }
    if(amount==""){
        ApiError(400,"amount is important to add");    
    }
    const avatarLocalPath= req.files?.avatar[0]?.path 
    console.log(avatarLocalPath)
    if(!avatarLocalPath){
       throw new ApiError(400,"Avatar file path  is compulsory");
    }

    const avatarcopy =await uploadOnCloudinary(avatarLocalPath) 
    // if(!avatarcopy){
    //     throw new ApiError(400,"Avatar link is not working")
    // }
    
     const packageS= await Package.create({
        title,
        description,
        avatar:avatarcopy?.url || "",
        amount,
        eventOwnerId,
        vendorOwnerId
     })
     return res.status(200)
     .json(
        new ApiResponse(200,packageS,"package created successfully")
     )
})

//=======================================================================================================

// update package or edit package details

const updatePackage = asyncHandler(async (req, res) => {
    // Get package ID from request parameter
    const packageId = req.params.packageId;
  
    // Validate package ID presence
    if (!packageId) {
      throw new ApiError(400, "Please provide package ID to update.");
    }
  
    // Get updated package details from request body
    const { title, description, thumbnail,imageList,amount } = req.body;
  
    // Find the package by ID
    const packages = await Package.findById(packageId);
  
    // Check if package exists
    if (!packages) {
      throw new ApiError(404, "Package not found.");
    }       
    
    if(title===""){
        ApiError(400,"title is important to add");
    }
    if(description===""){
        ApiError(400,"description is important to add"); 
    }
    

    if(!req.files){
        throw new ApiError(501,"req file is not present !");
    }
    const avatarLocalPath= req.files?.thumbnail[0]?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is compulsory");
     }

     const avatar =await uploadOnCloudinary(avatarLocalPath)
     if(!avatar){
        throw new ApiError(400,"Avatar link is not working")
     }

     const packageS= await Package.findByIdAndUpdate(packageId,{
        title,
        description,
        thumbnail:avatar.url,
        imageList,
        amount
     })
     return res.status(200)
     .json(
        new ApiResponse(200,packageS,"package updated successfully")
     )
})

//=======================================================================================================

// delete package or delete package details

const deletePackage= asyncHandler(async(req,res)=>{
    const packageId =req.params.packageId;
    console.log("this is package id in delete package",packageId);
    if(!packageId){
      throw new ApiError(400,"Please provide package ID to delete.");
    }

    const packages= await Package.findById(packageId);
    if(!packages){
      throw new ApiError(404,"Package not found");
    }

    const deletePackageSuccessfully=await packages.deleteOne();
    if(deletePackageSuccessfully){
      console.log("package deleted successfully");
    }
    return res.status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "package deleted successfully"
      )
    )
 })


const getPackage= asyncHandler(async(req,res)=>{
    const packageId =req.params.packageId;
    if(!packageId){
      throw new ApiError(400,"Please provide package ID to delete.");
    }

    const packages= await Package.findById(packageId);
    if(!packages){
      throw new ApiError(404,"Package not found");
    }

    return res.status(200)
    .json(
      new ApiResponse(
        200,
        packages,
        "package received successfully"
      )
    )
 })

export {
    addPackage,
    updatePackage,
    deletePackage,
    getPackage
}                                       