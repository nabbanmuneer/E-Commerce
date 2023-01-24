
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
// const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

const usersRouter=require('./routes/userRouter');//routes path for the userRoutes 
const adminRouter=require('./routes/adminRouter');//routes path for the adminRoutes
const brandsRouter=require('./routes/brandsRouter');//routes path for the brandsRoutes
const categoriesRouter=require('./routes/categoriesRouter');//routes paath for the brandsRoutes
const sub_categoiesRouter=require('./routes/sub_CategoriesRouter');//routes path for the brands
const productRouter=require('./routes/productRouter');//routes paath for the prodcut
const itemRouter=require('./routes/itemRouter');//routes path for the items
const cartRouter=require('./routes/cartRouter');//routes path for cart
const checkoutRouter=require('./routes/checkoutRouter');//routes for checkout
const wishlistRouter=require('./routes/wishlistRouter');//routes for wishlist

const methodOverride=require("method-override");

const app=express();
dotenv.config();
app.use(methodOverride("_method"));
app.use(express.json());
//const { Session } = require("inspector");
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const MongoDBStore = require('connect-mongodb-session')(session);


app.use(function (req, res, next) {
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
});

const store = new MongoDBStore({
    uri: "mongodb://127.0.0.1:27017/hamnasProject",
    collection: 'sessionValues'
});
store.on('error', function (error) {
    console.log(error);
});
app.use(
    session({
        secret: 'This is a secret',
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        },
        store: store,
        resave: false,
        saveUninitialized: false
}));


app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname,'public')));//path that for the public

app.use(express.static('views'));

app.use('/',usersRouter);//the user calling
app.use('/admin',adminRouter);//the admin calling 
app.use('/brand',brandsRouter);//the brands calling
app.use('/categories',categoriesRouter);//the category calling
app.use('/sub_Catogeries',sub_categoiesRouter);//the calling sub_categories
app.use('/product',productRouter);//the product calling
app.use('/item',itemRouter);//the item calling
app.use('/cart',cartRouter);//the cart calling
app.use('/checkout',checkoutRouter);
app.use('/wishlist',wishlistRouter);

app.get('*',(req,res)=>{
    res.render("./adminViews/page-error-404.ejs")
})

mongoose.connect(process.env.MONGODB_URL_LOCAL).then(()=>{
    app.listen(dotenv.PORT,()=>{
        console.log("listing port 3000")
    });
});



