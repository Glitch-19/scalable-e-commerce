const mongoose =require('mongoose');


const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    stock:{type:Number,default:0},
    category:{type:String},
},{timestamps:true});

const Product = mongoose.model('product',productSchema);
module.exports=Product;
