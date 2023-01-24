const mongoose = require('mongoose');
const { stringify } = require('querystring');
const validator=require('mongoose-unique-validator');
const { render } = require('ejs');
const exp = require('constants');
const sub_categoiesModels=require("../model/subCategoiesModel");
const categoryModels = require('../model/categoriesModel')  


const subCategoriesadd=async (req,res)=>{
    try{
    categories=await categoryModels.find();
    res.render("./adminViews/addSubCategories",{value:categories})
    }catch(error){
        res.redirect('/404')
    }
}
exports.subCategoriesadd=subCategoriesadd


const subCategoriespost=async(req,res)=>{
    let {sub_category,category_id}=req.body;
    category_id=category_id.trim();
    const sub_categoriesData=new sub_categoiesModels({sub_category, category_id});
    try{
        sub_categoriesData.save();
        
        res.redirect('/sub_Catogeries')
    }catch(error){
        
        res.redirect('/sub_Catogeries')
    }
}
exports.subCategoriespost=subCategoriespost