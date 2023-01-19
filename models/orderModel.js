import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    shippingInfo:{
        address:{type: String ,required: true},
        city:{type: String,required: true},
        state:{type: String, required: true},
        country:{type: String, required: true},
        pincode:{type: Number, required: true},
        phoneNo:{type: Number, required: true}
    },
    orderedItems:[
        {
            name:{type: String, required: true},
            price:{type: Number,required: true},
            quantity:{type: Number,required: true},
            image:{type: String, required: true},
            product:{
                type: mongoose.Schema.ObjectId,
                ref: "Books",
                required: true
            }
        }
    ],
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: true
    },
    paymentInfo:{
        id:{type: String, required: true},
        status:{type: String, required: true},
    },
    paidAt:{
        type: Date,
        required: true
    },
    itemsPrice:{
        type: Number,
        deafult: 0,
        required: true
    },
    taxPrice:{
        type: Number,
        deafult: 0,
        required: true
    },
    shippingPrice:{
        type: Number,
        deafult: 0,
        required: true
    },
    totalPrice:{
        type: Number,
        deafult: 0,
        required: true
    },
    orderStatus:{
        type: String,
        required: true,
        default: "Processing"
    },
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model("order",orderSchema);