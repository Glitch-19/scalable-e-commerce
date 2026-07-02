const express=require('express');
const Order=require('../models/Order');
const verifyToken=require('../middleware/auth');
const router=express.Router();


router.post('/',verifyToken,async(req,res)=>{
try{
console.log("Decoded Token Data:", req.user);
const orderData={
    ...req.body,
    userId:req.user.id
}
console.log("Data going to MongoDB:", orderData);
const newOrder=await Order.create(orderData);
res.status(201).json({
    message:"Order created successfully",
    order:newOrder
});
}catch(error){
    res.status(500).json({
        message:"Error creating order",
        error:error.message
    });
}
});
module.exports=router;