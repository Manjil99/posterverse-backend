import catchasyncError from "../middleware/catchAsyncErrors.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment = catchasyncError(async (req,res,next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
        metadata:{
            company:"Posterverse"
        },
    });
    res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret
    });
});

export const sendStripeApiKey = catchasyncError(async (req,res,next) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    });
});