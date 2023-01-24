const mongoose = require('mongoose');

const productmodel=require("../model/productModel")
const adminModel = require("../model/adminModel");
const brandsDds=require("../model/BrandsModel");
const userModel=require("../model/userModel")
const orderModel=require("../model/orderModel")
const bannerModel=require("../model/bannerModel")
const couponModel=require("../model/couponModel")


//**********admin login page ***********************/
const adminLogin=(req,res)=>{
    res.render("./adminViews/page-login")
}
exports.adminLogin=adminLogin; //*admin login get */

 const adminLoginpost=async (req,res)=>{
  const { Email, Password } = req.body;
    message=" ";
    let user;
    try {
        user = await adminModel.findOne({ Email });
        if (Email == "admin@123" && Password == "123456") 
        {
                req.session.admin_id=Email;
                res.redirect('/admin')
        }
        else{
          msg="INAVLID user";
          // console.log("error in pass")
        // console.log(Email,Password);
          res.redirect('/admin/login')
        }

    } catch (error) {
        msg ="invalid user"
        res.redirect('/admin/login')
        // console.log("error")
        // console.log(Email,Password)
        //return msg
    }
 }
exports.adminLoginpost=adminLoginpost;



//***********admin register page***************************/
const adminRegistration=(req,res)=>{
    res.render("./adminViews/page-register")
}
exports.adminRegistration=adminRegistration;





//**************admin index page************************/
const adminIndex=async (req,res)=>{
    try{
      let count=0
      let total=0
      let date_ob =new Date();
      let date = ("0" + date_ob.getDate()).slice(-2);
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      let year = date_ob.getFullYear();
      let today=date+"/"+month+"/"+year
      let account =await userModel.find()
      let customer=await orderModel.find()
      customer=customer.length
      let productquantity=await orderModel.aggregate([{
        $unwind:'$product'
      }])
      
      for( i=0;i<productquantity.length;i++){
        count=count +  productquantity[i].product.quantity
        total=total+productquantity[i].total
      }
      let Count=account.length



      //  console.log(Delivered);
      res.render("./adminViews/index",{count,today,total,customer,Count})
    }catch(error){
      res.redirect('/404')
    }
}
exports.adminIndex=adminIndex;

//*****************brands**************/


const brandGet=(req,res)=>{
  res.render("./adminViews/brands")
}
exports.brandGet=brandGet;
//-------------add brands---------------
const addBrandGet=(req,res)=>{
  res.render("./adminViews/addbrands")
}
exports.addBrandGet=addBrandGet

const addBrandPost=async (req,res)=>{
  const {brand}=req.body;
  //console.log(brand)
  const brandadd = new brandsDds ({
    brand
  })
  try{
      await brandadd.save() 
      res.redirect('/admin/addbrand')
  }catch(error){
    // console.log("error in brand db" ,brandadd);
    res.redirect('/brands/addbrand')
  }
}
exports.addBrandPost=addBrandPost;

//------------user details--------
const userPage=async(req,res)=>{
  try{
    const userData=await userModel.find()
    // console.log("data User",userData,userData[0].userStatus)
    
    res.render('./adminViews/userDetails',{userData})
  }
  catch(error){
    res.redirect('/404')
  }
}
exports.userPage=userPage;

const userBlock=async(req,res)=>{
  let user_Id=req.body.userId
  let action=req.body.action
  // console.log("user",user_Id,"action",action)
  try{
    if(action=="unblock"){
      userStatus="true"
      await userModel.findByIdAndUpdate(user_Id,{userStatus:"true"});
    }
    else if(action=="block"){
      userStatus="false"
      await userModel.findByIdAndUpdate(user_Id,{userStatus:"false"});
    }
    res.send({userStatus})
  }catch(error){
    res.redirect('/404')
  }
}
exports.userBlock=userBlock


const orderView=async (req,res)=>{
try{
  let  orderDat=await orderModel.find()
  let  order=await userModel.find()
  let orderData=await orderModel.aggregate([{
    $lookup:{ 
      from:'userdbs',
      localField:'user_Id',
      foreignField:'_id',
      as:'user'
    }
  }
])
  // console.log(orderData[5].user)
  res.render("./adminViews/orderManagment",{orderData})
}catch(error){
  res.redirect('/404')
}
}
exports.orderView=orderView

const deliveryOption=async(req,res)=>{
  try{
    let order_Id=req.body.order_Id
    let option=req.body.option
    // console.log(option,order_Id);
    if(option=="Shipped"){

      await orderModel.findByIdAndUpdate(order_Id,{deliveryStatus:"Shipped"})
    }else if(option=="Delivered"){
      await orderModel.findByIdAndUpdate(order_Id,{deliveryStatus:"Delivered"})
    }else{
      await orderModel.findByIdAndUpdate(order_Id,{deliveryStatus:"Ordered"})
    }
    // console.log("data")
    res.send({option})
  }catch(error){
    res.redirect('/404')
  }
}
exports.deliveryOption=deliveryOption

const paymentOption=async(req,res)=>{
  try{

    let order_Id=req.body.order_Id
    let option=req.body.option
    // console.log(option,order_Id);
    if(option=="success"){
      await orderModel.findByIdAndUpdate(order_Id,{paymentStatus:"success"})
    }else{
      await orderModel.findByIdAndUpdate(order_Id,{paymentStatus:"Pending"})
    }
    res.send({option})
  }catch(error){
    res.redirect('/404')
  }
}
exports.paymentOption=paymentOption

const banner=async(req,res)=>{
  res.render("./adminViews/bannerMangment")
}
exports.banner=banner

const bannerPost=async(req,res)=>{
  let {banner}=req.body;
  // console.log(banner);
  const bannerStatus = "false"
  const banneradd = new bannerModel ({banner,bannerStatus})
  banneradd.image=req.files.map(ban => ({ url: ban.path, filename: ban.filename }))
  try{
      await banneradd.save() 
      res.redirect('/admin/bannerShow')
      // console.log("brand add to dbs");
  }catch(error){
    res.redirect('/404')
  }
}
exports.bannerPost=bannerPost


const bannerShow=async (req,res)=>{
  try{
  let bannerData=await bannerModel.find()
  res.render("./adminViews/banner",{bannerData})
  }catch(error){
    let bannerData=0
    res.redirect('/404')
  }
}
exports.bannerShow=bannerShow

const bannerSelector=async(req,res)=>{
  let ban_id=req.body.ban_id
  let select=req.body.select
  let find=await bannerModel.findById(ban_id)
  // console.log("log",find);
  try{
    // console.log("befoe",select,ban_id);
    if(select == "true" ){
      select="false"
      await bannerModel.findByIdAndUpdate(ban_id,{bannerStatus:select})
      //console.log(data);
    }else{
      select="true"
      await bannerModel.findByIdAndUpdate(ban_id,{bannerStatus:select})
      //console.log("tr",data)
    }
    // console.log("after",select,ban_id);
    res.send({ban_id,select})
  }catch(error){
    res.redirect('/404')
  }

}
exports.bannerSelector=bannerSelector

const couponAdd=async (req,res)=>{
  res.render("./adminViews/coupon")
}
exports.couponAdd=couponAdd


const couponPost=async(req,res)=>{
  let couponName=req.body.coupon_Name;
  let couponCode=req.body.coupan_Code;
  let couponExpires=req.body.coupan_Expire;
  let couponAmount=req.body.couponAmount;
  let couponMinAmount=req.body.couponMinAmount
  const newCoupon=new couponModel({couponName,couponMinAmount,couponCode,couponAmount,couponExpires})
  try{
    await newCoupon.save()
    // console.log(newCoupon);
    res.redirect('/admin/couponShow')
  }catch(error){
    res.redirect('/404')
  }
  // let expire=new Date(new Date().getTime() + dateexpire *60 * 60 * 24 * 1000)
  // console.log("Date: "+ expire.getDate()+"/"+(expire.getMonth()+1)+"/"+expire.getFullYear())
  // console.log(couponName,couponCode,couponExpires);
}
exports.couponPost=couponPost

const couponShow=async(req,res)=>{
  try{
    let coupon=await couponModel.find();
    res.render('./adminViews/couponShow',{coupon})
  }catch(error){
    res.redirect('/404')
  }
  }
exports.couponShow=couponShow

const logout=async(req,res)=>{
  req.session.destroy();
  res.redirect('/')
}
exports.logout=logout

const chart=async(req,res)=>{
  let value=[]
  let quantity=[]
  let date=0
  let month =0
  let year =0
  try{
  let shipped=await orderModel.aggregate([{
    $match:{
      deliveryStatus:"Shipped"
    }
  }])
  let ordered= await orderModel.aggregate([{
    $match:{
      deliveryStatus:"ordered"
    }
  }])

  let Delivered= await orderModel.aggregate([{
    $match:{
      deliveryStatus:"Delivered"
    }
  }])
  value.push(Delivered.length)
  value.push(shipped.length)
  value.push(ordered.length)
  // console.log(value);
  res.send({value});
}catch(error){
  res.redirect('/404')
}
}
exports.chart=chart


const orderDetails=async(req,res)=>{

  let order_Id=req.body.order_Id
  // console.log(order_Id)
  try{
    let order=await orderModel.find({_id:order_Id});
    res.render('./adminViews/detailOrders.ejs',{order})
}catch(error){
  res.redirect('/404')
}
}
exports.orderDetails=orderDetails

const saleReport=async(req,res)=>{
  let r=[]
  let total=[]

let orderData=await orderModel.aggregate(
  [
      { $match: {paymentStatus:"success"} },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 },orders: { $push: '$$ROOT' } } },
      { $sort: { _id: 1 } }
  ],

)
let sale=0
// console.log(orderDat[0].order.length)
  for(let i=0;i<orderData.length;i++){
       r=orderData[i].orders
       sale=0
      //  console.log(i,"dddd",r)        
      for(let j=0;j<r.length;j++){
        sale=sale+r[j].total
        console.log(j,sale)
      }
    total[i]=sale
    }
    let totalorder=orderData.reduce((a, b) => a + b.count, 0);
  
   let totals=total.reduce((a, b) => a + b, 0)
   console.log(totalorder,totals);
res.render('./adminViews/salesReport',{orderData,total,totals,totalorder})
}
exports.saleReport=saleReport

// $group": {
//   _id: {
//     $dateToString: { format: "%d/%m/%Y", date: "$created_at", timezone: "Australia/Melbourne" } // group by date
//   },
//   orders: { $push: '$$ROOT' }

const errorHandeller=(req,res)=>{
  res.render('./adminViews/page-error-404')
}
exports.errorHandeller=errorHandeller