import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const feedbackSchema= new Schema(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        rating:{
            type:String,
            required:true,
            min:1,
            max:5
        },
        comment:{
            type :String,
            required:true
        },
        eventowner:{
            type:Schema.Types.ObjectId,
            ref:'Event',
            required:true

        },
        date:{
            type:Date,
            default:Date.now
        }

    },
    {
        timestamps:true
    }
 )
 feedbackSchema.plugin(mongooseAggregatePaginate);

 export const FeedBack = mongoose.model("Feedback",feedbackSchema);