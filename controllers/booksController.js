/* Here all the books related functionalities implemented CRUD basically with authentication attached to the flow */

import Books from "../models/bookModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchasyncError from "../middleware/catchAsyncErrors.js";
import Apifeatures from "../utils/apifeatures.js";
import cloudinary from "cloudinary";
// Create product Admin

export const createBooks = catchasyncError(async (req,res,next) => {

    let images = [];
    if(typeof req.body.images === "string"){
        images.push(req.body.images);
    }else{
        images = req.body.images;
    }

    //console.log(req.body);

    const imagesLinks = [];
    
    for (let i = 0; i < images.length; i++) {
       // console.log(i);
        //console.log(images[i]);
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
    
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
   // console.log(-1);
  //  console.log(imagesLinks);
    
    req.body.images = imagesLinks;

    const book = new Books(req.body);

    await book.save();
   

    res.status(201).json({success:true, book});
   // console.log("success!");
});


// Find product Admin

export const getAllBooks =  catchasyncError(async (req,res,next) => {

    const apifeatures = new Apifeatures(Books.find() , req.query).search().filter();

    const books = await apifeatures.query;
    
    res.status(200).json({success:true , books});

});

export const getAdminBooks =  catchasyncError(async (req,res,next) => {

    const books = await Books.find();
    
    res.status(200).json({success:true , books});

});

// Get Book Details 

export const getBookDetails = catchasyncError(async (req,res,next) => {

    let book = await Books.findById(req.params.id);

    if(!book){
        return next(new ErrorHandler("Book Not Found!",404));
    }

    res.status(200).json({success:true,book});
}); 
  

// Update product Admin


export const updateBooks = catchasyncError(async (req,res,next) => {

    let book = await Books.findById(req.params.id);

    if(!book){
        return next(new ErrorHandler("Book Not Found!",404));
    }

    let images = [];
    
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
    if (images !== undefined) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < book.images.length; i++) {
        await cloudinary.v2.uploader.destroy(book.images[i].public_id);
        }
        
        const imagesLinks = [];
        
        for (let i = 0; i < images.length; i++) {
            
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });
        
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
      }

        req.body.images = imagesLinks;
    }

    
    book = await Books.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    }); 

    res.status(200).json({success:true,book});
});


// Delete Product Admin

export const deleteBooks = catchasyncError(async (req,res,next) => {

    let book = await Books.findById(req.params.id);

    if(!book){
        return next(new ErrorHandler("Book Not Found!",404));
    } 

    for (let i = 0; i < book.images.length; i++) {
        await cloudinary.v2.uploader.destroy(book.images[i].public_id);
    }

    await book.remove(); 

    res.status(200).json({success:true,message:"Book deleted successfully"});
});


export const createBookreview = catchasyncError(
    async (req,res,next) => {

        const {rating,comment,bookId} = req.body;

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating,
            comment
        }

        const book = await Books.findById(bookId);

        if(book.reviews.length === 0){
            book.reviews.push(review);
        }else {
            let isreviewed = false;
            book.reviews.forEach(
                rev => {
                    if(rev.user.toString() === review.user.toString()){
                        rev.comment = comment;
                        rev.rating = rating;
                        isreviewed = true;
                    }
                }
            );
            if(!isreviewed)book.reviews.push(review);
        }
        book.numOfReviews = book.reviews.length;

        let avg = 0;

        book.reviews.forEach(rev => avg += rev.rating);

        book.ratings = avg / book.numOfReviews;

        await book.save({validateBeforeSave: false});

        res.status(200).json({
            success: true,
            message: "reviews added",
            book
        })
    }
);



export const getBookreview = catchasyncError(
    async (req,res,next) => {

        const book = await Books.findById(req.query.id);

        if(!book)return next(new ErrorHandler("Book not found",404));

        res.status(200).json({
            success: true,
            reviews: book.reviews
        });
    }
);

export const deleteBookReview = catchasyncError(
    async (req,res,next) => {

        const book = await Books.findById(req.query.bookId);

        if(!book)return next(new ErrorHandler("Book not found",404));


        const reviews = book.reviews.filter(
            (rev) => rev._id.toString() !== req.query.id.toString()
        );

        let avg = 0;

        reviews.forEach( rev => avg += rev.rating);

        let ratings = 0;

        if(reviews.length)ratings = avg / reviews.length;

        const numOfReviews = reviews.length;


        await Books.findByIdAndUpdate(req.query.bookId,{
            reviews,
            ratings,
            numOfReviews
        },{
            new:true,
            runValidators:true,
            useFindAndModify:false,
        });

        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
        });
    }
);