const auth=require("../middleware/auth")
const express = require('express');
const routes=express.Router();
const checkoutControllers=require("../controllers/checkoutControllers");

routes.get("/",auth.userAuth,checkoutControllers.checkout)

routes.post("/addressSave",auth.userAuth,checkoutControllers.addressSave)

routes.post('/order',auth.userAuth,checkoutControllers.orderPlace)
 routes.post('/verify',auth.userAuth,checkoutControllers.paymentSuccess)


routes.get('/orderPage',auth.userAuth,checkoutControllers.orderPages)

routes.post('/coupon',auth.userAuth,checkoutControllers.couponPost)

module.exports=routes;