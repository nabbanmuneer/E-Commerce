const mongoose = require('mongoose');
const { stringify } = require('querystring');
const validator=require('mongoose-unique-validator');


const adminSchema=new mongoose.Schema({
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
})

adminSchema.plugin(validator)
module.exports=mongoose.model("adminDbs",adminSchema);