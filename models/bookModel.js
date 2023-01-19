import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Please Enter Product Name"]
        },
        genre:{
            type:String,
            required:[true,"Please provide Genre"]
        },
        description:{
            type:String,
            required:[true,"Please Enter Product Description"]
        },
        price:{
            type:Number,
            required:[true,"Please Enter Product Price"],
        },
        ratings:{
            type:Number,
            default:0
        },
        images:[
            {
                public_id:{
                    type:String,
                    required:true
                },
                url:{
                    type:String,
                    required:true
                }
            }
        ],
        stock:{
            type:Number,
            required:[true,"Please Provide Stocks Number"],
            maxLength:[4,"Stock cannot exceed 4 characters"],
            default:1
        },
        numOfReviews:{
            type: Number,
            default: 0
        },
        reviews:[
            {
                user:{
                    type: mongoose.Schema.ObjectId,
                    ref: "User",
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                rating: {
                    type: Number,
                    required: true
                },
                comment: {
                    type: String,
                    required: true
                }
            }
        ]
    }
);

export default mongoose.model("books",bookSchema);