const express = require('express');
const routes=express.Router();
const multer = require('multer');
const auth=require("../middleware/auth")
const { storage } = require('../coloudinary');
const upload = multer({ storage });
const brandsControllers=require("../controllers/brandsControllers");
routes.get("/",brandsControllers.brandGet)

//routes.get("/addbrand",brandsControllers.addBrandGet)

routes.route('/addBrand')
    .get(auth.adminAuth,brandsControllers.addBrandGet)
    .post(upload.array('image'),auth.adminAuth,brandsControllers.addBrandPost)

module.exports=routes;