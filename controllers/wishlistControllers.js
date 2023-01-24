const wishlistModel = require("../model/wishlistModel")
const sub_categoiesModels=require("../model/subCategoiesModel");
const categoryModel = require('../model/categoriesModel');
const productModel=require("../model/productModel");
const brandModel = require('../model/BrandsModel');

const userWishlist=async(req,res)=>{
    user_id=req.session.user_id
    try{
        const women=await categoryModel.aggregate([{
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
        const men=await categoryModel.aggregate([{
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
        const kids=await categoryModel.aggregate([{
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

        wish=await wishlistModel.aggregate([
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
            },
            {
                $lookup:{
                    from:'brandsdbs',
                    localField:'products.brand_id',
                    foreignField:'_id',
                    as:'brands'
                }
            },
            {
                $lookup:{
                    from:'categoriesdbs',
                    localField:'products.category_id',
                    foreignField:'_id',
                    as:'categories'
                }
        }

        ])

        // console.log(wish[0].products[0].image[0].url)
        res.render('./userViews/shop-wishlist',{wish,kids,men,women,user_id})
    }catch(error){
        res.redirect('/404')
    }
}
exports.userWishlist=userWishlist;

const addlist=async(req,res)=>{
    user_Id=req.session.user_id
    product_Id=req.body.product_Id
    //console.log(product_Id);
    const add=new wishlistModel({
        user_Id:user_Id,
        product_Id:product_Id
    })
    try{
        add.save()
        res.send({product_Id})
      //  console.log(add);
    }
    catch(error){
        res.redirect('/404');
    }
}
exports.addlist=addlist

const wishRemove=async (req,res)=>{
    try{
        wish_Id=req.body.wish_Id;
        //console.log(wish_Id)
    await wishlistModel.findByIdAndDelete(wish_Id)
    res.send({wish_Id})
    }catch(error){
        res.redirect('/404')
    }

}
exports.wishRemove=wishRemove