const mongoose = require('mongoose');
const { stringify } = require('querystring');
const validator=require('mongoose-unique-validator');

const wishlistSchema=new mongoose.Schema({

    user_Id:ObjectId,
    product_Id:ObjectId

})
wishlistSchema.plugin(validator)
module.exports=mongoose.model("wishlistDbs",wishlistSchema);
