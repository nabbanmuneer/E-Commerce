const mongoose = require('mongoose');
const { stringify } = require('querystring');
const validator=require('mongoose-unique-validator');
const { render } = require('ejs');
const exp = require('constants');
const sub_categoiesModels=require("../model/subCategoiesModel");
const categoryModels = require('../model/categoriesModel');
const productModel=require("../model/productModel");
const brandModel = require('../model/BrandsModel');
const { constants } = require('crypto');
const { Console } = require('console');
const ObjectId = require('mongodb').ObjectId

//----------------Get----------------------
const productGet=async(req,res)=>{
    try{
    const brand=await brandModel.find();
    const category=await categoryModels.find();
    ////console.log(brand,category);
    res.render("./adminViews/addproducts",{brand:brand,category:category})
    }catch(error){
        res.redirect('/404')
    }
}
exports.productGet=productGet;


//--------------------fetch-----------------
const productlookup =async(req,res)=>{
    try{
    let id=req.body.categoryId;
    id=id.trim();
    //console.log(id)
    const subcategory=await sub_categoiesModels.find({
        category_id:id
    });
    ////console.log(subcategory)
    res.send({subcategory});
}catch(error){
    res.redirect('/404')
}
}
exports.productlookup=productlookup


//----------------------Post---------------------
const productPost=async (req,res)=>{
    ////console.log(req.body)
    let {product_name,details,price,mrp,description,small_stock,medium_stock,large_stock,xtraLarge_stock,brand_id,category_id,subcategory_id}=req.body;
    ////console.log(product_name,brand_id,category_id,subcategory_id,details,price,mrp,description);
    brand_id= brand_id.trim();
    category_id=category_id.trim();
    subcategory_id= subcategory_id.trim();
    
    const image=req.files.map(f=>({url:f.path,filename:f.filename}))
    
    const product = new productModel({product_name,brand_id,category_id,subcategory_id,details,price,mrp,description,image})
    product.product_size.small = small_stock;
    product.product_size.medium = medium_stock;
    product.product_size.large = large_stock;
    product.product_size.xtraLarge = xtraLarge_stock;
    try{
        await product.save();
        
        res.redirect('/product')
    }
    catch(error){
        //console.log(error);
        
        res.redirect('/product')
    }
}
exports.productPost=productPost

//----------------show product----------------
const productShow=async (req,res)=>{
    try{
    const productData=await productModel.aggregate([{
        $lookup:{
            from:'brandsdbs',
            localField:'brand_id',
            foreignField:'_id',
            as:'brands'
        }  

    },
    {
        $lookup:{
            from:'categoriesdbs',
            localField:'category_id',
            foreignField:'_id',
            as:'categories'
        }
    },
    {
        $lookup:{
            from:'sub_categoriesdbs',
            localField:'subcategory_id',
            foreignField:'_id',
            as:'subcategories'
        }  

    }])
    ////console.log("Post");


    res.render('./adminViews/productShow',{productData})
    }catch(error){
        res.redirect('/404')
    }
}
exports.productShow=productShow

const productedit=(res,req)=>{
    res.render('./adminViews/editproduct');
}
exports.productedit=productedit

const productEdit=async (req,res)=>{
    try{
    const id =await productModel.findById(req.body)
    const uid=id._id

    const brand=await brandModel.find()
    const category=await categoryModels.find()
    const brandsEdit=await productModel.aggregate([{
        $match:{
            _id:uid
        }
    },
    {
        $lookup:{
            from:'brandsdbs',
            localField:'brand_id',
            foreignField:'_id',
            as:'brands'
        }  

    }])
    const categoriesEdit=await productModel.aggregate([{
        $match:{
            _id:uid
        }
    },
    {
        $lookup:{
            from:'categoriesdbs',
            localField:'category_id',
            foreignField:'_id',
            as:'categories'
        }
    }])
    const subcategoriesEdit=await productModel.aggregate([{
        $match:{
            _id:uid
        }
    },
    {
        $lookup:{
            from:'sub_categoriesdbs',
            localField:'subcategory_id',
            foreignField:'_id',
            as:'subcategories'
        }  

    }])
    //console.log("show product");
    res.render('./adminViews/editproduct',{brandsEdit,subcategoriesEdit,categoriesEdit,brand,category,id})  
    }catch(error){
        res.redirect('/404')
    }
}
exports.productEdit=productEdit;

const productPut=async (req,res)=>{
    try{
    const {uid} = req.params
    //console.log("editproduct")
    let{ product_name, description, details, small_stock, medium_stock, large_stock, xtraLarge_stock, price, mrp, category_id, brand_id, subcategory_id } = req.body
    brand_id= brand_id.trim();
    category_id=category_id.trim();
    subcategory_id= subcategory_id.trim();
    ////console.log(product_name, description, details, small_stock, medium_stock, large_stock, xtraLarge_stock, price, mrp, category_id, brand_id, subcategory_id);
    const product = await productModel.findByIdAndUpdate(uid, { product_name, description, details, price, mrp, category_id, brand_id, subcategory_id })
    product.product_size.small = small_stock;
    product.product_size.medium = medium_stock;
    product.product_size.large = large_stock;
    product.product_size.xtraLarge = xtraLarge_stock;
    
    await product.save();
    res.redirect('/product/productShow')
    }catch(error){
        res.redirect('/404')
    }
}
exports.productPut=productPut
//----------------------------------------------------