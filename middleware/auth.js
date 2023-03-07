import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchasyncError from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";

export const isAuthenticatedUser = catchasyncError(
    async (req,res,next) => {
        const { token } = req.cookies;

      // console.log(req);
      
        if(!token){

            return next(new ErrorHandler("Please Log in to access",401));
        }

        const decodedData = jwt.verify(token,process.env.JWT_SECRET);
       

        req.user = await User.findById(decodedData.id);
       

        next();
    }
);

export const authorizeRoles = (roles) => {
    
     return (req,res,next) => {
        if(roles === req.user.role){
            next()
        }else {
            return next(
                new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`,403)
            );
        }
     }
}