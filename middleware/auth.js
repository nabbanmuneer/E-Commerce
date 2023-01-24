

const adminAuth=async(req,res,next)=>{
    let admin_id=req.session.admin_id
    if(admin_id){
        next()
    }else{
        res.redirect('/admin/login')
    }
}
exports.adminAuth=adminAuth

const userAuth=async(req,res,next)=>{
    let user_id=req.session.user_id
    if(user_id){
        next()
    }else{
        res.redirect('/login')
    }
}
exports.userAuth=userAuth

const userIdAuth=async(req,res,next)=>{
    let user_id=req.session.user_id
    if(user_id){
        res.redirect('/')
    }else{
        next()
    }
}
exports.userIdAuth=userIdAuth