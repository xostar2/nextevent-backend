import { FeedBack } from '../models/feedback.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const feedbackForm =asyncHandler(async(req,res)=>{
    try{
        const {rating,comment,eventowner} = req.body;
        
        if(!rating || !comment || !eventowner){
            throw new ApiError(400,"Please provide all the required fields")
        }
        const feedback = new FeedBack({
            userId:req.user.id,
            rating,
            comment,
            eventowner
        })
        await feedback.save();
        console.log("feedback::::::",feedback)
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                {feedbackForm},
                "feedback from user submitted successfully"
            )
        )
        
    }catch(error){
        console.log(error,"error wil feedback controller")
    }
})

const getfeedback = asyncHandler(async(req,res)=>{
    try{    
        const feedbacks = await FeedBack.find()
        console.log("feedback::::::",feedbacks)
        return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {feedbacks},
                    "Feedback from user submitted successfully"
                )
            )
    }catch(error){
        console.log(error,"error wil feedback controller")
    }
})

export {
    feedbackForm,
    getfeedback
}