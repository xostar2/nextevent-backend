import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const eventSchema = new Schema(
    {
        
        eventName:{
            type:String,
            enum:[
                "Conferences",
                "Seminars",
                "Workshops",
                "Team Building Events",
                "Trade Shows",
                "Business Dinners",
                "Networking Events",
                "Product Launches",
                "VIP Events",
                "Award Ceremonies",
                "Office Parties",
                "Weddings",
                "Birthday Parties",
                "Anniversary Celebrations",
                "Baby Showers",
                "Engagement Parties",
                "Family Reunions",
                "Graduation Parties",
                "Holiday Parties",
                "Concerts",
                "Festivals",
                "Sporting Events",
                "Charity Events",
                "Community Events",
                "Political Rallies",
                "Public Demonstrations",
                "Movie Premieres",
                "Fashion Shows",
                "Celebrity Parties",
                "Entertainment and Award Nights",
                "Brand Promotions",
                "Sales Promotions",
                "Retail Promotions",
                "Roadshows",
                "Academic Conferences",
                "Alumni Events",
                "Lectures and Talks",


            ],
            required:true,
          
           
        },
        createDate:{
            type:Date,
            default:Date.now
        },
        thumbnail:{
            type:String,//cloudinary url
        },
        packageList:[
            {
                type:Schema.Types.ObjectId,
                ref:"Package"
            }
        ],
        description:{
            type:String,
            required:true
        },
        rating:{
            type:Schema.Types.ObjectId,
            ref:"Feedback"
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"Vendor",
            required:true
        },
        city:{
            type:String,
            required:true
        }

    },
    {timestamps:true}
)

eventSchema.index({ eventName: 1, owner: 1 }, { unique: true });

eventSchema.plugin(mongooseAggregatePaginate);

  
export const Event = mongoose.model("Event",eventSchema);