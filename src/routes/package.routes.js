import {Router} from 'express';
import { addPackage, updatePackage, deletePackage,getPackage} from '../controllers/package.controller.js';
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/authvendor.middleware.js';
import { verifyJWT as verifyJWT1 } from '../middlewares/auth.middleware.js';
import { Package } from '../models/package.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';

const router = Router()




router.route("/addpackage").post(

    upload.fields(//using multer here for upload file 
        [
            {
                name:"avatar",
                maxCount:1
            }
        ]
        ),
    addPackage
    )

router.route("/getpackage").get(verifyJWT,getPackage)
router.route("/updatepackage").put(verifyJWT,updatePackage)
router.route("/deletepackage/:packageId").delete(verifyJWT,deletePackage)
router.route("/getallpackage/:eventId").get(verifyJWT,async (req,res)=>{
    const eventId=req.params.eventId;
    
    try {
      if(!eventId){
        throw new ApiError(400,"Please provide event ID to get package.");
      }
      const packages= await Package.find({eventOwnerId:eventId});
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
    } catch (error) {
      return new ApiError(error.statusCode, error.message);
      
    }
 }) 
 router.route("/getallpackages/:eventId").get(verifyJWT1,async (req,res)=>{
  const eventId=req.params.eventId;
  
  try {
    if(!eventId){
      throw new ApiError(400,"Please provide event ID to get package.");
    }
    const packages= await Package.find({eventOwnerId:eventId});
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
  } catch (error) {
    return new ApiError(error.statusCode, error.message);
    
  }
}) 

 

export default router               