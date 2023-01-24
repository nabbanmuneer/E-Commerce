const auth=require("../middleware/auth")
const { Router } = require('express');
const express = require('express');
const routes=express.Router();

const useritemControllers=require('../controllers/userItemControllers');


routes.get('/itemDetail/:uid',useritemControllers.itemDetail)

routes.get('/:uid/:name',useritemControllers.productList);


module.exports=routes;