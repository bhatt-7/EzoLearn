const express = require("express");

const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
//const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const database = require('./config/db');

const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require('./config/cloudinary');
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;
database.connect();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:["https://ezo-learn.vercel.app/","https://vercel.com/ayush-bhatts-projects-922f2026/ezo-learn/3ctxWqJbzfYAYQa6SmRPKvDjUsy5","https://ezo-learn-ayush-bhatts-projects-922f2026.vercel.app/"],
        credentials:true,
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

cloudinaryConnect();

//rputes

app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
//app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/payment", paymentRoutes);
//app.get

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up"
    })
})


app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`);
})