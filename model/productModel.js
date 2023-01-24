const mongoose = require('mongoose');
const { stringify } = require('querystring');
const validator=require('mongoose-unique-validator');

const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const productSchema=new Schema({
    product_name: {
        type: String,
        trim: true
    },
    brand_id:ObjectId,
    category_id: ObjectId,
    subcategory_id: ObjectId,
    description: {
        type: String,
        trim: true
    },
    details: {
        type: String,

        trim: true
    },
    product_size: {
        small: {
            type:Number
        },
        medium: {
            type:Number
        },
        large: {
            type:Number
        },
        xtraLarge:{
            type:Number
        }

    },
    price: {
        type: Number,

        trim: true
    },
    mrp: {
        type: Number,

        trim: true
    },
    image: [
        {
            url: String,
            filename: String,

        }
    ]
})

productSchema.plugin(validator);
module.exports=mongoose.model("productDbs",productSchema);