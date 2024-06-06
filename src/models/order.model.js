import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const orderSchema= new Schema(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        packageName:{
            type:String,
            required:true
        },
        packageId:{
            type:Schema.Types.ObjectId,
            ref:'Package',
            required:true
        },
        vendorId:{
            type:Schema.Types.ObjectId,
            ref:'Vendor',
            required:true
        },
        orderDate:{
            type:Date,
            default:Date.now
           
        },
        status:{
            type:String,
            enum:['pending', 'reject','accept'],
            default:"pending"
        },
        amount:{
            type:String,
            required:true
        },
        description:{
            type:String,
            default:""
        },
        eventDate:{
            type:Date,
            default:Date.now
        },
        locations:{
            type:String,
            default:""
        }


    },
    {
        timestamps:true
    }
 )
 orderSchema.plugin(mongooseAggregatePaginate);

 export const Order = mongoose.model("Order",orderSchema);