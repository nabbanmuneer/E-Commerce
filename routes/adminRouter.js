const express = require('express');
const routes=express.Router();
const multer = require('multer');
const auth=require("../middleware/auth")
const { storage } = require('../coloudinary');
const upload = multer({ storage });

const adminControllers=require("../controllers/adminControllers");


routes.get("/login",adminControllers.adminLogin);
routes.post("/loginPost",adminControllers.adminLoginpost);

routes.get("/userDetails",auth.adminAuth,adminControllers.userPage);

routes.post("/block",auth.adminAuth,adminControllers.userBlock)

routes.get("/",auth.adminAuth,adminControllers.adminIndex)

routes.get("/orderView",auth.adminAuth,adminControllers.orderView)

routes.post("/delivaryOption",auth.adminAuth,adminControllers.deliveryOption)

routes.post("/paymentOption",auth.adminAuth,adminControllers.paymentOption)


routes.route("/banner")
    .get(auth.adminAuth,adminControllers.banner)
    .post(upload.array('image'),auth.adminAuth,adminControllers.bannerPost)

routes.get("/bannerShow",auth.adminAuth,adminControllers.bannerShow)

routes.post('/select',auth.adminAuth,adminControllers.bannerSelector)

routes.get("/coupon",auth.adminAuth,adminControllers.couponAdd)
routes.post("/couponPost",auth.adminAuth,adminControllers.couponPost)

routes.get("/couponShow",auth.adminAuth,adminControllers.couponShow)

routes.post("/chart",auth.adminAuth,adminControllers.chart)

routes.post("/orderDetails",auth.adminAuth,adminControllers.orderDetails)

routes.get("/salesReport",auth.adminAuth,adminControllers.saleReport)

routes.post("/logout",auth.adminAuth,adminControllers.logout)

routes.get('/404',adminControllers.errorHandeller)

module.exports=routes;