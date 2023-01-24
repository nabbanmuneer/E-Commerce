const mongoose = require('mongoose');
const { stringify } = require('querystring');
const validator=require('mongoose-unique-validator');
//const Category =require('./categoriesModel');

const Schema=mongoose.Schema
ObjectId = Schema.ObjectId;

sub_categoiesSchema=new Schema({
    sub_category:{
        type:String,
        require:true,
    },
    category_id : ObjectId
})
sub_categoiesSchema.plugin(validator);
module.exports=mongoose.model("sub_categoriesDbs",sub_categoiesSchema);