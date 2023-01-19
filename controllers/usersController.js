// all user related functions
//forgot password not applied will use it later

import ErrorHandler from "../utils/errorhandler.js";
import catchasyncError from "../middleware/catchAsyncErrors.js";
import Users from "../models/userModel.js";
import sendToken from "../utils/jwtToken.js";
import cloudinary from "cloudinary";


//Register User
export const registerUser = catchasyncError(async (req,res,next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: "avatars",
        width: 150,
        crop: "scale"
    });
    const {name,email,password} = req.body;
    const user = new Users({
        name,
        email,
        password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    });

    await user.save();
    
    sendToken(user,201,res);

});


//Login user
export const loginUser = catchasyncError(async (req,res,next) => {
    
    //const {name,email,password} = req.body;
    const {email,password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Invalid Email or Password",400));
    }

    const user =  await Users.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }

    const isPasswordMatching = await user.comparePassword(password);


    if(!isPasswordMatching){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }

    sendToken(user,200,res);

});


//Logout user
export const logoutUser = catchasyncError(async (req,res,next) => {

    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.clearCookie();
    res.status(200).json({
        success: true,
        message: "Logged Out"
    });
});


//Get User details
export const getUserdetails  = catchasyncError(
    async (req,res,next) => {

        const user = req.user;
        

        res.status(200).json({
            success: true,
            user
        });
    }
);

//Update User password
export const updatePassword  = catchasyncError(
    async (req,res,next) => {

        const user = await Users.findById(req.user.id).select("+password");

        const isPasswordMatching = await user.comparePassword(req.body.oldPassword);

        if(!isPasswordMatching){
            return next(new ErrorHandler("Old Password Incorrect",400));
        }

        if(req.body.newPassword !== req.body.confirmPassword){
            return next(new ErrorHandler("password doesnot match",400));
        }

        user.password = req.body.newPassword;

        await user.save();

        sendToken(user,200,res);
    }
);


//Update User Profile
export const updateProfile  = catchasyncError(
    async (req,res,next) => {

        const newUserDetails = {
            name: req.body.name,
            email: req.body.email
        }

        if(req.body.avatar !== ""){
            const user = await Users.findById(req.user.id);
            const imageId = user.avatar.public_id;
            await cloudinary.v2.uploader.destroy(imageId);

            const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
                folder: "avatars",
                width: 150,
                crop: "scale"
            });
            newUserDetails.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }

        const user = await Users.findByIdAndUpdate(req.user.id,newUserDetails,{
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            message: "Successfully updated",
            user
        });
    }
);

//Get all user details admin
export const getAllUser = catchasyncError(
    async (req,res,next) => {
        const users = await Users.find();

        res.status(200).json({
            success: true,
            users
        })
    }
);

//Get single user details admin
export const getSingleUser = catchasyncError(
    async (req,res,next) => {
        const user = await Users.findById(req.params.id);

        if(!user){
            return next(new ErrorHandler(`user does not exist with id: ${req.params.id}`,400));
        }

        res.status(200).json({
            success: true,
            user
        })
    }
);

//Update User Role admin
export const updateUserRole  = catchasyncError(
    async (req,res,next) => {

        const newUserDetails = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        }


        const user = await Users.findByIdAndUpdate(req.params.id,newUserDetails,{
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            message: "Successfully updated",
            user
        });
    }
);


//Delete a user --admin
export const deleteUser  = catchasyncError(
    async (req,res,next) => {

        

        const user = await Users.findById(req.params.id);

        if(!user)return next(new ErrorHandler(`user does not exists with id: ${req.params.id}`,400));

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        await user.remove();

        res.status(200).json({
            success: true,
            message: "Successfully deleted",
        });
    }
);
