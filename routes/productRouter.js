const { Router } = require('express');
const express = require('express');
const auth=require("../middleware/auth")
const produtControllers=require("../controllers/productControllers");
const multer = require('multer');
const { storage } = require('../coloudinary');
const upload = multer({ storage });
const routes=express.Router();

routes.route("/")
    .get(auth.adminAuth,produtControllers.productGet)
    .post(upload.array('image'),auth.adminAuth,produtControllers.productPost)

routes.post('/fetch',auth.adminAuth,produtControllers.productlookup)

//routes.post('/productAdd',produtControllers.productPost)

routes.get('/productShow',auth.adminAuth,produtControllers.productShow)

routes.get('/productEdit',auth.adminAuth,produtControllers.productedit)

routes.post('/productEdit',auth.adminAuth,produtControllers.productEdit);
routes.put('/productPut/uid',auth.adminAuth,produtControllers.productPut);

module.exports=routes;