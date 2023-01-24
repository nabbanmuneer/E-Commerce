const { Router } = require('express');
const express = require('express');
const routes=express.Router();

const userModel = require("../model/userModel");
const sub_categoiesModels=require("../model/subCategoiesModel");
const categoryModels = require('../model/categoriesModel');
const productModel=require("../model/productModel");
const brandModel = require('../model/BrandsModel');
const subCategoiesModel = require('../model/subCategoiesModel');
const cartModel = require('../model/cartModel');
const { find } = require('lodash');
const { default: mongoose } = require('mongoose');


//---------------------getting the cart--------------------------
const cartItem=async(req,res)=>{
    try{
    let user_id=req.session.user_id;
    let product_id=req.params.uid;
    let size=req.body.size;
    let quantity=req.body.quantity;
    let mrp=req.body.mrp;
    let product_Name=req.body.name
    console.log(product_Name)
    product_id=mongoose.Types.ObjectId(product_id)
    //const user =await userModel.find({_id:user_id})
    // console.log(user_id,product_id,cartData,product);
    const product=await cartModel.aggregate([{
        $match:{
            user_Id:user_id,product_Id:product_id,size:size
        }
    }])
    if(product[0])
    {
        //console.log(product,"already in cart");
        res.redirect("/cart");
    }
    else{
        const cartSave = new cartModel ({
            product_Id:product_id,
            product_Name:product_Name,
            user_Id:user_id,
            size:size,
            quantity:quantity,
            mrp:mrp
        })
        await cartSave.save() 
        // console.log(cartSave)
        res.redirect('/cart')
    }
}catch(error){
    res.redirect('/404')
}
    // res.render("./userViews/shop-shopping-cart",{})
}
exports.cartItem=cartItem
//-----------------------------------------------------------------
//----------------------renderin cart------------------------------
const cartShow= async (req,res)=>{
    let user_id=req.session.user_id;
    try{
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
        const cartProduct=await cartModel.aggregate([
            {
                $match:{
                    user_Id:user_id
                }
            },
            {
                $lookup:{
                from:'productdbs',
                localField:'product_Id',
                foreignField:'_id',
                as:'products'
            }
            }
        ])
        let total=0
        for(let i=0;i<cartProduct.length;i++)
        {
            total=total+cartProduct[i].mrp*cartProduct[i].quantity
        }
        
        let shipping=0
        shipping=total*(5/100)
        res.render("./userViews/shop-shopping-cart",{cartProduct,total:total,shipping:shipping,men,women,kids,user_id})
    }catch(error){
        res.redirect('/404')
    }   
}
exports.cartShow=cartShow
//------------------------------------------------------------
//------cart inline change through fetch----------------------

const cartEdit=async(req,res)=>{
    //console.log('cart fetch');
    try{

    let cartid=req.body.productId
    let size=req.body.size
    let value=req.body.value
    
    let data=await cartModel.find({_id:cartid})
    let quantity=data[0].quantity
    // console.log(quantity)
    
    let total=0
    let mrp=0
    if(value > 0)
    {
        quantity=quantity+1;
        const cartData=await cartModel.findByIdAndUpdate(cartid,{quantity:quantity})
        const carttotal=await cartModel.find();
            mrp=quantity*cartData.mrp
              for(let i=0;i<carttotal.length;i++)
              {
                total=total+(carttotal[i].mrp*carttotal[i].quantity)
              }
    }
    else if(value < 0){
        quantity=quantity-1;
        const cartData=await cartModel.findByIdAndUpdate(cartid,{quantity:quantity})
    
        const carttotal=await cartModel.find();
        mrp=quantity*cartData.mrp
              for(let i=0;i<carttotal.length;i++)
              {
                total=total+(carttotal[i].mrp*carttotal[i].quantity)
              }
    }
    res.send({data,total,mrp})
}catch(error){
    res.redirect('/404')
}
}
exports.cartEdit=cartEdit
//-------------------------------------------------
//-----------cart delete---------------------------
const cartDelete=async (req,res)=>{
    try{
    const cart_id=req.body.cart_id
    cartData=await cartModel.deleteOne({_id:cart_id})
    res.redirect('/cart')   
    }catch(error){
        res.redirect('/404')
    }
}
exports.cartDelete=cartDelete;
//---------------------------------------------------