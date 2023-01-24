const express = require('express');
const routes=express.Router();
const wishlistControllers=require("../controllers/wishlistControllers");
const auth=require("../middleware/auth")
const { route } = require('./itemRouter');


routes.get("/",auth.userAuth,wishlistControllers.userWishlist);

routes.post('/addList',auth.userAuth,wishlistControllers.addlist);

routes.post('/remove',auth.userAuth,wishlistControllers.wishRemove);

module.exports=routes;