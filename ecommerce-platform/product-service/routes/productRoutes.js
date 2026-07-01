const express= require('express');
const product=require('../models/Product');
const router= express.Router();
router.post("/",async(req,res)=>{
    try{
        const newProduct =await product.create(req.body);
        res.status(201).json({
            message:"Product created successfully!",
            product:newProduct
        })

    }catch(error){
        console.error('❌ Error creating product:', error);
        res.status(500).json({
            error:"internal server error"
        })
    }

})
router.get("/",async(req,res)=>{
    try{
        const products = await product.find();
        res.status(200).json({
            message:"products fetched successfully!",
            products:products
        })
    }catch(error){
        console.error('❌ Error fetching products:', error);
        res.status(500).json({
            error:"internal server error"
        })
    }

})
module.exports=router;
