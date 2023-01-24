const mongoose = require('mongoose');
const { stringify } = require('querystring');
const validator=require('mongoose-unique-validator');


const couponSchema=new mongoose.Schema({
    couponName:{
        type:String,
        require:true,
    },
    couponCode:{
        type:String,
        require:true,
    },
    couponMinAmount:{
        type:Number,
        require:true
    },
    couponAmount:{
        type:Number,
        require:true
    },
    couponExpires:{
        type:Number,
        require:true
    }
},{timestamps:true})
    
couponSchema.plugin(validator)
module.exports=mongoose.model("coupondbs",couponSchema);