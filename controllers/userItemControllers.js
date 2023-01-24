const mongoose = require('mongoose');
const userModel = require("../model/userModel");
const sub_categoiesModels=require("../model/subCategoiesModel");
const categoryModels = require('../model/categoriesModel');
const productModel=require("../model/productModel");
const brandModel = require('../model/BrandsModel');
const { find } = require('lodash');
const subCategoiesModel = require('../model/subCategoiesModel');

const productList=async(req,res)=>{
    let user_id=req.session.user_id
    let name=req.params.name
    let uid=req.params.uid
    try{
        uid=mongoose.Types.ObjectId(uid)
        
        //console.log(uid)
        if(name == "brand")
        {
         products =await productModel.aggregate([{
            $match:{
                brand_id:uid
            }
            }])
        ////console.log(products)
        }
        else if( name== "category")
        {
         products =await productModel.aggregate([{
            $match:{
                category_id:uid
            }
            }])   
        }
        else if(name=="subCategory")
        {
            products =await productModel.aggregate([{
            $match:{
                subcategory_id:uid
            }
            }])
        }
        const women=await categoryModels.aggregate([{
            $match:{
                categories:"women"
            }},{
            $lookup:{
                from:'sub_categoriesdbs',
                localField:'_id',
                foreignField:'category_id',
                as:'subcategories'
            } 
        }])
        const men=await categoryModels.aggregate([{
            $match:{
                categories:"Men"
            }},{
            $lookup:{
                from:'sub_categoriesdbs',
    
                localField:'_id',
                foreignField:'category_id',
                as:'subcategories'
            } 
        }])
        const kids=await categoryModels.aggregate([{
            $match:{
                categories:"Kids"
            }},{
            $lookup:{
                from:'sub_categoriesdbs',
                localField:'_id',
                foreignField:'category_id',
                as:'subcategories'
            } 
        }])
    res.render('./userViews/shop-product-list',{products,kids,men,women,user_id})
    }catch(error){
        res.redirect('/404')
    }
    // //console.log(products)
}
exports.productList=productList;

const itemDetail=async (req,res)=>{
    let user_id=req.session.user_id
    let{uid}=req.params
    try{
        uid=mongoose.Types.ObjectId(uid)
        const women=await categoryModels.aggregate([{
            $match:{
                categories:"women"
            }},{
            $lookup:{
                from:'sub_categoriesdbs',
                localField:'_id',
                foreignField:'category_id',
                as:'subcategories'
            } 
        }])
        const men=await categoryModels.aggregate([{
            $match:{
                categories:"Men"
            }},{
            $lookup:{
                from:'sub_categoriesdbs',
    
                localField:'_id',
                foreignField:'category_id',
                as:'subcategories'
            } 
        }])
        const kids=await categoryModels.aggregate([{
            $match:{
                categories:"Kids"
            }},{
            $lookup:{
                from:'sub_categoriesdbs',
                localField:'_id',
                foreignField:'category_id',
                as:'subcategories'
            } 
        }])
        const product=await productModel.aggregate([{
            $match:{
                _id:uid
            }
        }])
        // //console.log(product);
        res.render('./userViews/shop-item',{product,kids,men,women,user_id})
    }catch(error){
        res.redirect('/404')
    }
}
exports.itemDetail=itemDetail;

