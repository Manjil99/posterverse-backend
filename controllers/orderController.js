import Order from "../models/orderModel.js";
import Books from "../models/bookModel.js"
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncError from "../middleware/catchAsyncErrors.js";

// Create New Order
export const newOrder = catchAsyncError(
    async (req,res,next) => {
        const {shippingInfo , orderedItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body;
        //console.log(orderedItems);
        const order = new Order({
            shippingInfo , 
            orderedItems, 
            paymentInfo, 
            itemsPrice, 
            taxPrice, 
            shippingPrice, 
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id
        });

        await order.save();

        res.status(201).json({
            success: true,
            order
        });

    }
);

//Get Single Order
export const getSingleOrder = catchAsyncError(
    async (req,res,next) => {

        const order = await Order.findById(req.params.id).populate("user","name email");

        if(!order)return next(new ErrorHandler("Order not found with this id",404));

        res.status(200).json({
            success: true,
            order
        });

    }
);

//Get logged in user orders
export const getmyOrders = catchAsyncError(
    async (req,res,next) => {

      //  console.log(1); 
        const orders = await Order.find({user: req.user._id});

        if(!orders)return next(new ErrorHandler("Order not found with this id",404));

        res.status(200).json({
            success: true,
            orders
        });

    }
);


//get all order admin
export const getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();
  
    let totalAmount = 0;
  
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
  
    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  });

 // update Order Status -- Admin
 export const updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
  
    if (order.orderStatus === "Delivered") {
      return next(new ErrorHandler("You have already delivered this order", 400));
    }
  
    if (req.body.status === "Shipped") {
      order.orderedItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
      });
    }
    order.orderStatus = req.body.status;
  
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }
  
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  });
  
  async function updateStock(id, quantity) {
    const book = await Books.findById(id);
  
    book.stock -= quantity;
  
    await book.save({ validateBeforeSave: false });
  }
  
  // delete Order -- Admin
  export const deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
  
    await order.remove();
  
    res.status(200).json({
      success: true,
    });
  });
  
 