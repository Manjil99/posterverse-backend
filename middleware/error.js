import ErrorHandler from "../utils/errorhandler.js";

const actualErrorHandler = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error!";

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    });
}

export default actualErrorHandler;