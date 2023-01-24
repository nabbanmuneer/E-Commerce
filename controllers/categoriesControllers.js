
const mongoose = require('mongoose');
const { stringify } = require('querystring');
const validator=require('mongoose-unique-validator');
const { render } = require('ejs');
const exp = require('constants');
const categoriyModels = require('../model/categoriesModel')  



//-------------------------MAIN CATEGORIES---------------------------------
const categoriesadd=(req,res)=>{
    res.render("./adminViews/addCategories")
}
exports.categoriesadd=categoriesadd;


const categoriesPost=async (req,res)=>{
    const {categories} = req.body;  
    const categoriyData=new categoriyModels({categories});
    try{
        await categoriyData.save();
        //console.log(categories)
        res.redirect("/categories/catogeriesAdd")
    }catch(error){
        res.redirect("/404")
    }

}
exports.categoriesPost=categoriesPost





