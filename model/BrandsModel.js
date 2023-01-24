const mongoose = require('mongoose');
const { stringify } = require('querystring');
const validator=require('mongoose-unique-validator');


const BrandSchema=new mongoose.Schema({
    brand:{
        type:String,
        require:true,
        unique:true
    // },
    // joinDate:{type:rigth.now();
    },
    image: [

        {
            url: String,
            filename: String,

        }
    ]
})
    
BrandSchema.plugin(validator)
module.exports=mongoose.model("brandsDbs",BrandSchema);