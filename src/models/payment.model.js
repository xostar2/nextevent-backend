import mongoose,{Schema} from mongoose;
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const paymentSchema= new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
          },
          order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true
          },
          amount: {
            type: Number,
            required: true
          },
          paymentDate: {
            type: Date,
            default: Date.now
          },
          paymentMethod: {
            type: String,
            enum: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'],
            required: true
          },
          status: {
            type: String,
            enum: ['Pending', 'Completed', 'Failed'],
            default: 'Pending'
          }

    },
    {
        timestamps:true
    }
 )
 userSchema.plugin(mongooseAggregatePaginate);

 export const Payment = mongoose.model("Payment",paymentSchema);