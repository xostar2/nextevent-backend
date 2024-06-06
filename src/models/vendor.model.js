import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const vendorSchema = new Schema(
    {
        
        vendorName: {
            type:String,
            required:true,
            unique: true,
            lowercase :true,
            trim:true,
            index:true
        },
        companyName: {
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar : {
            type:String,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase :true,
            trim:true,
            index:true
        },
        gender:{
            type: String,
            enum:[ "Male" , "Female","Divided"]  
        },
        phone:{
            type:String,
            required:true,
            trim:true,
        },
        aadhaar:{
            type:String,
            trim:true,
            
        },
        address:{
            type:String,
        },
        password : {
            type:String,
            required:[true,"Password is required"]
        },
        registrationNo:{
            type:String,
            trim:true,
        },
        refreshToken:{
            type:String
        },
        startDate:{
            type:Date,
            default:Date.now()

        } ,
        city:{
            type:String,
            require:true,
        },
        eventList:[
            {
            type: Schema.Types.ObjectId,
            ref : "Event"
            }
        ]

    },
    {
        timestamps:true
    }

);

vendorSchema.plugin(mongooseAggregatePaginate);

vendorSchema.pre("save", async function(next){
    if(!this.isModified("password"))return next();
    this.password=await  bcrypt.hash(this.password,10);
    console.log(this.password)  
    next();
 })

 vendorSchema.methods.isPasswordCorrect= async function (password){
    return await bcrypt.compare(password,this.password);
 }

 vendorSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
           
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
 }
 
 vendorSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY

        }
     )
 }
    



export const Vendor = mongoose.model('Vendor',vendorSchema); 