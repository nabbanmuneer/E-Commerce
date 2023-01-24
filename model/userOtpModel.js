const { stringify } = require('querystring');
const mongoose = require('mongoose');


const UserOtpSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    Password:{
        type:String,
        require:true
    },
    Number:{
        type:Number,
        require:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{type:Date,default:Date.now,index:{expires:300}}
},{timestamps:true})


module.exports=mongoose.model('userOtp',UserOtpSchema)