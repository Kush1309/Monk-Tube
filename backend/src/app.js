import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//cookie ka use hai mere server se browser ki cookie the access kar sakt HU Ya read kar sakte hai
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public")) //koi bhi access kar sakta hau
app.use(cookieParser())


//route import
import userRouter from './routes/user.routes.js'
//routes declaration
app.use("/api/v1/users", userRouter)

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || []
    });
});
// https://localhost:8000/api/v1/users/register

export { app }