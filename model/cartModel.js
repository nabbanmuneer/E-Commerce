const mongoose = require('mongoose');
const { stringify } = require('querystring');
const validator=require('mongoose-unique-validator');

const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const cartSchema=new Schema({
    product_Id:ObjectId,
    user_Id:ObjectId,
    size:{
        type:String
    },
    product_Name:{
        type:String
    },
    mrp:{
        type:Number
    },
    quantity:{
        type:Number
    },
})
cartSchema.plugin(validator);
module.exports=mongoose.model("cartDbs",cartSchema);