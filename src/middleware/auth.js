const jwt=require('jsonwebtoken')
const cookieparser=require('cookie-parser')
const Login=require('../model/login_model');

const auth=async(req,res,next)=>{
    try{
const token=req.cookies.gym;
    const verifyuser=jwt.verify(token,process.env.SECRET);
    const user=await Login.findOne({_id:verifyuser._id})
    console.log(user);
    
   // return user.email;
    next();
    }
    catch(e){
console.log('error in auth')
    }
}

module.exports=auth;