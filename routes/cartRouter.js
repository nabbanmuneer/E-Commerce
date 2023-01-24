const { Router } = require('express');
const express = require('express');
const auth=require("../middleware/auth")
const cartControllers=require('../controllers/cartControllers')
const routes=express.Router();


routes.get('/',auth.userAuth,cartControllers.cartShow)
routes.post('/cartSave/:uid',auth.userAuth,cartControllers.cartItem);

routes.post('/cartEdit',auth.userAuth,cartControllers.cartEdit);

routes.post('/cartDelete',auth.userAuth,cartControllers.cartDelete);

module.exports=routes;