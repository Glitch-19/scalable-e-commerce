const mongoose= require('mongoose');

const orderSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    products:[
        {
            productId:{
                type:String,
                required:true
            },
            quantity:{
                type :Number,
                required:true,
                default:1
            }
        }
    ],
    totalAmount:{
        type:Number,
        required:true
    }
},{timestamps:true});

const Order = mongoose.model('Order',orderSchema);
module.exports=Order;