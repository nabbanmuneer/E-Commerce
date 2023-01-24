const mongoose = require('mongoose');
//const _ = require('lodesh');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const categoryModels = require('../model/categoriesModel');
const productModel = require("../model/productModel");
const brandModel = require('../model/BrandsModel');
const otpGenerator = require('otp-generator');
const userModel = require("../model/userModel");
const userOtpModel = require('../model/userOtpModel');
const bannerModel = require('../model/bannerModel');
const dotenv = require("dotenv")

require('dotenv/config');
let userData = " "
let msg = " ";

let transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: true,
    service: 'Gmail',

    auth: {
        user: process.env.NODEMAILER_AUTH_USER,
        pass: process.env.NODEMAILER_AUTH_PASS
    }

});




//**************************login */
const userLogin = async (req, res) => {
    try {
        msg = " "
        const women = await categoryModels.aggregate([{
            $match: {
                categories: "women"
            }
        }, {
            $lookup: {
                from: 'sub_categoriesdbs',
                localField: '_id',
                foreignField: 'category_id',
                as: 'subcategories'
            }
        }])
        const men = await categoryModels.aggregate([{
            $match: {
                categories: "Men"
            }
        }, {
            $lookup: {
                from: 'sub_categoriesdbs',
                localField: '_id',
                foreignField: 'category_id',
                as: 'subcategories'
            }
        }])
        const kids = await categoryModels.aggregate([{
            $match: {
                categories: "Kids"
            }
        }, {
            $lookup: {
                from: 'sub_categoriesdbs',
                localField: '_id',
                foreignField: 'category_id',
                as: 'subcategories'
            }
        }])
        res.render('./userViews/shop-login', { msg, kids, men, women })
    } catch (error) {
        res.render('./adminViews/page-error-404')
    }

}
exports.userLogin = userLogin;

const userLoginpost = async (req, res) => {
    const { Email, Password } = req.body;
    console.log(Email, Password)
    msg = " ";
    try {
        let user = await userModel.find({
            Email: Email, userStatus: "true"
        });
        // console.log(user[0].Email)
        if (Email == user[0].Email) {
            const validate = await bcrypt.compare(Password, user[0].Password)
            if (validate) {

                req.session.user_id = user[0]._id;
                res.redirect('/')
            }
            else {

                res.redirect('/login')
            }
        }
        else {
            msg = "INAVLID EMAIL";

            res.redirect('/login')
        }
    } catch (error) {

        res.redirect('/login')

    }
}
exports.userLoginpost = userLoginpost;


//*******************************sign up */
const userRegister = async (req, res) => {
    try {

        const women = await categoryModels.aggregate([{
            $match: {
                categories: "women"
            }
        }, {
            $lookup: {
                from: 'sub_categoriesdbs',
                localField: '_id',
                foreignField: 'category_id',
                as: 'subcategories'
            }
        }])
        const men = await categoryModels.aggregate([{
            $match: {
                categories: "Men"
            }
        }, {
            $lookup: {
                from: 'sub_categoriesdbs',
                localField: '_id',
                foreignField: 'category_id',
                as: 'subcategories'
            }
        }])
        const kids = await categoryModels.aggregate([{
            $match: {
                categories: "Kids"
            }
        }, {
            $lookup: {
                from: 'sub_categoriesdbs',
                localField: '_id',
                foreignField: 'category_id',
                as: 'subcategories'
            }
        }])
        res.render('./userViews/shop-register', { kids, men, women })
    } catch (error) {
        res.redirect('/404')
    }
}
exports.userRegister = userRegister;

const userRegistrationPost = async (req, res) => {
    try {

        let otpdata = await userOtpModel.findOne({ userData })
        let otp = req.body.otp;
        let validate = await bcrypt.compare(otp, otpdata.otp)
        //  console.log(validate)
        let userStatus = "true"
        if (validate) {
            userSave = new userModel({ name: otpdata.name, Email: otpdata.Email, Password: otpdata.Password, Number: otpdata.Number, userStatus: userStatus });;
            userSave.save();
            // console.log("User register");
            res.redirect('/login')
            await userOtpModel.deleteMany({ Email: otpdata.EMAIL });

        }
        else {
            // console.log("otp is worng",req.body.otp);
            res.redirect("/registration")
        }
    } catch (error) {
        res.redirect('/404')
    }
};
exports.userRegistrationPost = userRegistrationPost;

const verifyOtp = async (req, res) => {
    try {
        console.log(req.body)
        const Email = await userModel.findOne({ Email: req.body.Email });
        if (Email) {

            res.redirect("/registration")
        }
        else {
            //  console.log("otp sended");
            const OTP = otpGenerator.generate(6, {
                digits: true, alphabets: false, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false
            })
            const { name, Email, Password, Number } = req.body;
            const mailOption = {
                from: process.env.AUTH_EMAIL,
                to: Email,
                subject: "verification OTP code",
                html: `<p>Enter your OTP</p><b>${OTP}</b><P>in the app to verify your email address and complete the sign up </p><p> This code <b> Expires in 5 Minutes</b>.</p>`
            }
            transporter.sendMail(mailOption, (error, info) => {
                // console.log("nodemailer");
                if (error) {
                    // return console.log(error);
                }
            })

            // console.log(OTP);
            const otp = new userOtpModel({ Number: Number, otp: OTP, name: name, Password: Password, Email: Email });
            const salt = await bcrypt.genSalt(10)
            otp.Password = await bcrypt.hash(otp.Password, salt)
            otp.otp = await bcrypt.hash(otp.otp, salt)
            otp.save();

            res.redirect("/otpverification")
        }
    } catch (error) {
        res.redirect('/404')
    }

}
exports.verifyOtp = verifyOtp

const otpVerification = (req, res) => {
    res.render('./userViews/shop-otp-verification')
}
exports.otpVerification = otpVerification






//*********************************home or index */
const userIndex = async (req, res) => {
    let user_id = req.session.user_id
    try {
        const banner = await bannerModel.find({ bannerStatus: "true" }).limit(4);
        const brand = await brandModel.find().limit(5);
        const product = await productModel.find()
        const women = await categoryModels.aggregate([{
            $match: {
                categories: "women"
            }
        }, {
            $lookup: {
                from: 'sub_categoriesdbs',
                localField: '_id',
                foreignField: 'category_id',
                as: 'subcategories'
            }
        }])
        const men = await categoryModels.aggregate([{
            $match: {
                categories: "Men"
            }
        }, {
            $lookup: {
                from: 'sub_categoriesdbs',
                localField: '_id',
                foreignField: 'category_id',
                as: 'subcategories'
            }
        }])
        const kids = await categoryModels.aggregate([{
            $match: {
                categories: "Kids"
            }
        }, {
            $lookup: {
                from: 'sub_categoriesdbs',
                localField: '_id',
                foreignField: 'category_id',
                as: 'subcategories'
            }
        }])
        // console.log()
        res.render('./userViews/shop-index', { brand, banner, kids, men, women, product, user_id });
    } catch (error) {
        res.redirect('/404')
    }
}
exports.userIndex = userIndex

//**********************************user Account */
// const userAccount=(req,res)=>{
//     res.render('./userViews/shop-account');
// }
// exports.userAccount=userAccount

//**********************************Loout */

const logOut = async (req, res) => {
    req.session.destroy();
    res.redirect('/');
}
exports.logOut = logOut

const errorHandeller = (req, res) => {
    res.render('./adminViews/page-error-404')
}
exports.errorHandeller = errorHandeller