import {Router} from "express";
import {
  addEvent,
  deleteEvent,
  getEvent,
  
} 
from "../controllers/event.controller.js";
import {Event} from "../models/event.model.js";

import {upload} from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/authvendor.middleware.js";
import { verifyJWT  as verifyJWT2 } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

router.route("/addevent").post(
  verifyJWT,
  upload.fields(
    //using multer here for upload file
    [
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]
  ),
  addEvent
);
router.route("/getevent").get(verifyJWT, getEvent);

router.route("/getuserevent").post(verifyJWT2, async (req, res) => {
  console.log("this is query for find right objects",req.body); // Extract search criteria
  const { eventName, city } = req.body;
  console.log(eventName, city);
  try {
    let query = {}; // Build query based on search criteria
    if (eventName) {
      query.eventName = { $regex: new RegExp(eventName, 'i') }; // Case-insensitive search
    }
    if (city) {
      query.city = { $regex: new RegExp(city, 'i') };
    }

    const events = await Event.find(query).populate("city").exec(); // Find events matching criteria
    console.log("events is in router", events);
    return res.status(200).json(
        new ApiResponse(
            200,
            events,
            "Events fetched successfully"
        )
      ); // Send response with events
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching events' }); // Handle errors
  }
});


router.route("/deleteevent/:eventId").delete(verifyJWT, deleteEvent);

export default router;
