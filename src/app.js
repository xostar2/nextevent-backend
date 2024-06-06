import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
    accessControlAllowHeaders:"Content-Type"
}));


app.use(express.json({
    limit:"16kb"
}))//data came from form

app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
})) //taking data from url

app.use(express.static("public"));//ststice files

app.use(cookieParser());


//routes import

import userRouter from './routes/user.routes.js'
import vendorRouter from './routes/vendor.routes.js'
import feedBackRouter from "./routes/feedback.routes.js"
import eventRouter from "./routes/event.routes.js"
import packagesRouter from "./routes/package.routes.js"
import orderRouter from "./routes/order.routes.js"
import adminRouter from "./routes/admin.routes.js"
import contactRouter from "./routes/contact.routes.js"

//routes declaration

app.use("/api/v1/users",userRouter);// http: //localhost:8000/api/v1/user/register
app.use("/api/v1/vendors",vendorRouter);
app.use("/api/v1/feedbacks",feedBackRouter);
app.use("/api/v1/events",eventRouter);
app.use("/api/v1/packages",packagesRouter);
app.use("/api/v1/orders",orderRouter);
app.use("/api/v1/admins",adminRouter);
app.use("/api/v1/contacts",contactRouter);

export {app}
