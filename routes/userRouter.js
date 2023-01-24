
const express = require('express');
const routes=express.Router();
const userControllers=require("../controllers/userControllers");

const auth=require("../middleware/auth")


routes.get("/",userControllers.userIndex);

routes.get("/login",auth.userIdAuth,userControllers.userLogin);
routes.post("/login",auth.userIdAuth,userControllers.userLoginpost);

routes.get("/registration",auth.userIdAuth,userControllers.userRegister)
routes.post("/registrationAdd",auth.userIdAuth,userControllers.userRegistrationPost);

routes.post("/registerOTP",auth.userIdAuth,userControllers.verifyOtp);

routes.get("/otpverification",auth.userIdAuth,userControllers.otpVerification);

// routes.get("/account",auth.userAuth,userControllers.userAccount);

routes.get('/404',userControllers.errorHandeller)

routes.get('/logout',auth.userAuth,userControllers.logOut)


module.exports=routes;