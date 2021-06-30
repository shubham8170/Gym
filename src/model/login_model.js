const mongoose =require('mongoose');
const express=require('express');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

//creating schema

const loginSchema=mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
       required:true,
        // minlength:8,
    },
    cpassword:{
        type:String,
       required:true,
        // minlength:8,
    },
    time:{
        type:String,

    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]


});

loginSchema.methods.generateAuthToken=async function(){
    try{
        const token =jwt.sign({
            _id:this._id.toString()
        },process.env.SECRET);
        console.log(token);
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token


    } 
    catch(e){
        console.log('token error')

    }

}



loginSchema.methods.addDateto=async function(val){
    try{
        this.time=val;
        await this.save()
        console.log('success added')
    }
    catch(e){
        console.log('error on add time')

    }
}




loginSchema.pre("save",async function (next){
    if(this.isModified("password")){
    // const sPass=await bcrypt.hash(password,15);
    this.password=await bcrypt.hash(this.password,10);
   // this.cpassword=await bcrypt.hash(this.cpassword,15);
}
    next();
})

const Login=new mongoose.model('Login',loginSchema)


module.exports=Login;