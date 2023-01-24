const mongoose = require('mongoose');
const { string } = require('querystring');
const validator=require('mongoose-unique-validator');

const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const orderSchema=new Schema({
    payamentType:{
        type:String
    },
    paymentStatus:{
        type:String
    },
    discount:{
        type:Number
    },
    user_Id:ObjectId,
    total:{
       type:Number
    },
    deliveryStatus:{
        type:String
    },
    product:[{
        productId:ObjectId,
        product_Name:String,
        size:String,
        mrp:Number,
        quantity:Number
    }],
    address:[{
        locality:String,
        city:String,
        region:String,
        country:String,
        post_code:Number,
        landMark:String
    }]
},{timestamps:true})
orderSchema.plugin(validator)
module.exports=mongoose.model("orderDbs",orderSchema);