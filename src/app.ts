import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import sendResponse from "./utils/sendResponse";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";


//*app initialization
const app=express();


//* setting cross origin options
var corsOptions ={
    origin:['http://localhost:3000'],
    optionsSuccessStatus: 200
}

//*Registering middleware

//?the following threer middlewaew allows Express to understand  different kind of (JSON,text etc) request bodies.
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended:true}));// Parses HTML form submissions (application/x-www-form-urlencoded), extended true for nested value

//?middleware for cookie and cors 
app.use(cookieParser());
app.use(cors(corsOptions));

//*Registering Routes

//? This is the root route 
app.get("/",(req:Request,res:Response)=>{
    sendResponse(res,{statusCode:200,success:true,message:"This is the rootRoute!!"});
});

//? Checks api status
app.get("/health", (req, res) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "API is healthy",
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});




//*custome middleware for global error handling. Without it the error is scattered.
app.use(globalErrorHandler);

export default app;