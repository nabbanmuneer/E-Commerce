const mongoose = require('mongoose');
const { stringify } = require('querystring');
const validator=require('mongoose-unique-validator');

categoiesSchema=new mongoose.Schema({
    categories:{
        type:String,
        require:true,
        unique:true
    }
})
categoiesSchema.plugin(validator);
module.exports=mongoose.model("categoriesDbs",categoiesSchema);
