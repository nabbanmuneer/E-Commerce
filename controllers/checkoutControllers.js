const express = require('express');
const { default: mongoose } = require('mongoose');
const routes=express.Router();
const Razorpay = require('razorpay')
const cartModel = require('../model/cartModel');
const userModel = require("../model/userModel");
const addressModel=require("../model/addressModel")
const orderModel=require("../model/orderModel")
const categoryModels = require('../model/categoriesModel');
const couponModel=require("../model/couponModel")

const crypto = require('crypto');
const productModel = require('../model/productModel');
let instance = new Razorpay({ key_id:'rzp_test_N8wYTR5bzHdNqv', key_secret:'doesJMIL3trJj3fhzaYH1iWp'})


const checkout=async (req,res)=>
{
    let user_id=req.session.user_id;
    // try{
       
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
        const cartData=await cartModel.aggregate([{
            $match:{
                user_Id:user_id
            }},{
            $lookup:{
                from:'productdbs',
                localField:'product_Id',
                foreignField:'_id',
                as:'products'
            } 
        }])
        // user_id=mongoose.Types.ObjectId(user_id) 
        const userData=await userModel.findOne({_id:user_id});
        
        const address=await addressModel.find({user_Id:user_id})
        
        let total=0;
        for(let i=0;i<cartData.length;i++)
        {
            total=total+cartData[i].mrp*cartData[i].quantity
        }
        res.render("./userViews/shop-checkout",{
            userData,
            cartData,
            total,
            address,
            men,
            women,
            kids,
            user_id
        })
    // }catch(error){
    //     res.redirect('/404')
    // }
}
exports.checkout=checkout;


const addressSave=async (req,res)=>{
    
    let user_Id=req.session.user_id
    let locality=req.body.locality
    let city=req.body.city
    let region=req.body.region
    let country=req.body.country
    let post_code=req.body.post_code
    let landMark=req.body.landMark
    const saveAddress = await addressModel.insertMany({
            user_Id:user_Id,
            locality:locality,
            city:city,
            region:region,
            country:country,
            post_code:post_code,
            landMark:landMark
    })
    
    // //console.log("update");
    // //console.log("up");
    res.send(saveAddress)
}
exports.addressSave=addressSave;

const orderPlace=async(req,res)=>{
    let payamentType=req.body.payamentType
    let total=req.body.total
    let addressId=req.body.addressId
    let paymentStatus="pending"
    let deliveryStatus="ordered"
    let discount=req.body.discount
    console.log(discount);
    let user_Id=req.session.user_id
    try{

        let address=await addressModel.find({_id:addressId})
        let user=await userModel.find({_id:user_Id})
        let cart=await cartModel.find({user_Id:user_Id})
        // //console.log(" user",user)
        //total=total/100;need to delete
        let order=new orderModel({user_Id,total,payamentType,paymentStatus,deliveryStatus,discount})
        let orderId=order._id
        for(let i=0;i<cart.length;i++){
            order.product.push({
                productId:cart[i].productId,
                product_Name:cart[i].product_Name,
                size:cart[i].size,
                mrp:cart[i].mrp,
                quantity:cart[i].quantity
            })
        }
        ////console.log(address);
        order.address.push({
            locality:address[0].locality,
            city:address[0].city,
            region:address[0].region,
            country:address[0].country,
            post_code:address[0].post_code,
            landMark:address[0].landMark
        
        })
        //console.log("==",order.address);
        if(payamentType == "CashOnDelivary")
        {
            await order.save()
                //console.log("cash",order);
                await cartModel.deleteMany({user_Id:user_Id});
                res.send({payamentType})
            
        }
        else{
            let name=user[0].name
            let Email=user[0].Email
            let Number=user[0].Number
            order.paymentStatus="failed"
            await order.save();
            //console.log("cmd",order);
            //console.log("user",user[0].name)
            const options = {
                amount:total*100, // amount in the smallest currency unit checkout.bill
                currency: "INR",
                receipt: "" + orderId
            };
            
            instance.orders.create( options,function (err,orderPlace) {
                 let orderId=orderPlace.id
                const userDetails = {
                    name,
                    Number,
                    Email,
                    address
                };
                
                ////console.log("orderId",orderId);
                res.send({
                    payamentType,
                    options,
                    userDetails,
                    orderId,
                    order
                });
                
                ////console.log("order111",order._id)   
                
            })
        }
        
    }catch(error){
        res.redirect('/404')
    }
}
exports.orderPlace=orderPlace


const paymentSuccess = async (req,res) => {
    try{
    const { response,payDetails,userDetails,orderId,order } = req.body;
    let hmac = crypto.createHmac('sha256', 'doesJMIL3trJj3fhzaYH1iWp');
    hmac = hmac.update(response.razorpay_order_id + "|" + response.razorpay_payment_id);
    hmac = hmac.digest('hex');
    let user_Id=userDetails.address[0].user_Id    
    //cartId=cartId.toString()
    let order_id=order._id
    //  //console.log("lll",response);
    if(hmac == response.razorpay_signature) {
         await cartModel.deleteMany({user_Id:user_Id});
         await orderModel.findByIdAndUpdate(order_id,{paymentStatus:'success'})
        // //console.log("confrim",order_id)
         res.send({paymentStatus:'success',payDetails});
     }else {
         await orderModel.findByIdAndUpdate(order_id,{paymentStatus:'fail'});
         res.send({paymentStatus:'fail'});
     }
    }catch(error){
        res.redirect('/404')
    }
}
exports.paymentSuccess=paymentSuccess


const orderPages = async(req,res) =>{
    const user_id=req.session.user_id
    try{
        let order=await orderModel.find({user_Id:user_id});
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

        res.render('./userViews/shop-order-form',{order,men,women,kids,user_id})
    }catch(error){
        res.redirect('/404')
    }
}
exports.orderPages=orderPages


const couponPost=async(req,res)=>{
    let couponCode=req.body.couponValue
    let subtotal=req.body.subtotal
    let status=" "
    // //console.log(couponCode,subtotal);
    try{
        let coupon= await couponModel.find({couponCode:couponCode})
        let expire=new Date(new Date().getTime() + coupon[0].couponExpires *60 * 60 * 24 * 1000)
        //console.log(expire)
        if(coupon[0].createdAt < expire){
           if( coupon[0].couponMinAmount <= subtotal){
                let discount=subtotal*(coupon[0].couponAmount/100)
                status="success"
                // //console.log(discount)
                res.send({status,discount})
           }else{
            status="expire"
            res.send({status})
           }
        }
    }catch(error){
        status="invalid"
        res.send({status})
    }
}
exports.couponPost=couponPost