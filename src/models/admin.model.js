import mongoose,{Schema} from "mongoose";

const adminSchema = new Schema({

    email: {
        type:String,
        required:true,
        
    },
    
    password : {
        type:String,
        required:[true,"Password is required"]
    },
},{timestamps:true})



export const Admin = mongoose.model("Admin",adminSchema);

 

 