const { Router } = require('express');
const express = require('express');
const auth=require("../middleware/auth")
const categoriesControllers=require('../controllers/categoriesControllers')
const routes=express.Router();


//routes.get('/test',auth.adminAuth,categoriesControllers.categoriestest);

routes.get('/catogeriesAdd',auth.adminAuth,categoriesControllers.categoriesadd);
routes.post('/catogeriesPost',auth.adminAuth,categoriesControllers.categoriesPost)

//routes.get('/subCatogeriesadd',categoriesControllers.subCategoriesadd)
module.exports=routes;