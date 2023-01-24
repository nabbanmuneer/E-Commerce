const mongoose = require('mongoose');
const { stringify } = require('querystring');
const validator=require('mongoose-unique-validator');
const jwt=require('jsonwebtoken');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true,
        unique:true
    },
    Password:{
        type:String,
        require:true
    },
    Number:{
        type:Number,
        require:true
    },
    userStatus:{
        type:Boolean,
        require:true
    }
},{timestamps:true});

// userSchema.method.generateJWT=function(){
//     const token =jwt.sign({
//         _id:thid._id,
//         number:this.number
//     },process.env.JWT_SECRET_KEY)
//     return token
// }

userSchema.plugin(validator)
module.exports=mongoose.model("userDbs",userSchema);