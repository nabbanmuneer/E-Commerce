const mongoose = require('mongoose');
const { string } = require('querystring');
const validator=require('mongoose-unique-validator');

const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const addressSchema=new Schema({
    user_Id:ObjectId,
        locality:{
            type:String,
            require:true,
            trim:true
        },
        city:{
            type:String,
            require:true,
            trim:true
        },
        region:{
            type:String,
            require:true,
            trim:true
        },
        country:{
            type:String,
            require:true,
            trim:true
        },
        post_code:{
            type:Number,
            require:true,
            trim:true
        },
        landMark:{
            type:String,
            trim:true
        }
    
})

addressSchema.plugin(validator)
module.exports=mongoose.model("addressDbs",addressSchema);