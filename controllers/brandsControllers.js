const brandModel = require('../model/BrandsModel');
const mongoose = require('mongoose');
const { stringify } = require('querystring');
const validator=require('mongoose-unique-validator');
const multer = require('multer');
const { storage } = require('../coloudinary');
const upload = multer({ storage });
//*****************brands**************/


const brandGet=async(req,res)=>{
  try{
    let brands =await brandModel.find();
    res.render("./adminViews/brands",{brands})
  }catch(error){
    res.redirect('/404')
  }
  }
  exports.brandGet=brandGet;
  //-------------add brands---------------
  const addBrandGet=(req,res)=>{
    res.render("./adminViews/addBrands")
  }
  exports.addBrandGet=addBrandGet
  //===============================================
  const addBrandPost=async (req,res)=>{
    const {brand}=req.body;
    const brandadd = new brandModel ({brand})
    brandadd.image=req.files.map(brandLogo => ({ url: brandLogo.path, filename: brandLogo.filename }))
    try{
        await brandadd.save() 
        res.redirect('/brand/addbrand')
        
    }catch(error){
      
      res.redirect('/brand/addbrand')
    }
  }
  exports.addBrandPost=addBrandPost;