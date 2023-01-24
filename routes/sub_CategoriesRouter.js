const { Router } = require('express');
const express = require('express');
const auth=require("../middleware/auth")
const routes=express.Router();

const sub_categoiesControllers=require("../controllers/sub_CategoriesControllers")

routes.get('/',auth.adminAuth,sub_categoiesControllers.subCategoriesadd)
routes.post('/subCategoriespost',auth.adminAuth,sub_categoiesControllers.subCategoriespost)


module.exports=routes;