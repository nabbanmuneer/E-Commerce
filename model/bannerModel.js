const mongoose = require('mongoose');
const { stringify } = require('querystring');
const validator=require('mongoose-unique-validator');


const bannerSchema=new mongoose.Schema({
    banner:{
        type:String,
        require:true,
    },
    bannerStatus:{
        type:Boolean,
        require:true
    },
    image: [
        {
            url: String,
            filename: String,

        }
    ]
})
    
bannerSchema.plugin(validator)
module.exports=mongoose.model("bannerdbs",bannerSchema);