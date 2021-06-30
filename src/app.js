require('dotenv').config()
const express=require('express');
const app=express();
const path=require('path')
require('./db/db')
const bcrypt = require('bcryptjs');
const Login=require('./model/login_model');
const e = require('express');
const jwt=require('jsonwebtoken')
const cookieparser=require('cookie-parser')
const auth=require('./middleware/auth')

const port=process.env.PORT || 80;

const static_path=path.join(__dirname,"../frontend")

app.use(cookieparser())
app.use(express.static(static_path))
app.use(express.json());
app.use(express.urlencoded())

app.set('view engine','pug')
app.set('views',path.join(__dirname,'../frontend/views'))
console.log(__dirname)

app.get('/',(req,res)=>{
    res.render('home')
});


app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/register',async(req,res)=>{
    try{
        const data=req.body;
        const password=data.fpassword;
   const cpassword=data.confirmpasspord;
        if(password==cpassword){
    console.log(req.body);
    console.log(req.body.text)
    
    const adddata=new Login({
        firstname:data.fname,
        lastname:data.lname,
        email:data.email,
        gender:data.gender,
        password:data.fpassword,
        cpassword:data.confirmpasspord
        

    });
        // const token=adddata.generateAuthToken();
        // console.log('token from app js',token)
        // res.cookie("jwt",token,{
        //     expires:new Date(Date.now()+30000),
        //     httpOnly:true
        // });
        // console.log(cookie)
   
       const confirmation=await adddata.save();
       console.log('save')
       res.render('home')


   }
   else{
       res.send('error')
   }
}
catch(error){
    res.send(error);
}

    
}
)



app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',async(req,res)=>{
    try{
    const pass=req.body.fpassword;
    const email=req.body.email;
    console.log(email)
    console.log(pass)
    const userDetails=await Login.findOne({email:email});
    console.log(userDetails.password)
    console.log(userDetails.cpassword)
    const originalpass=userDetails.password;
    
    


    const isMatch= await bcrypt.compare(pass,originalpass)
    console.log(originalpass)
    
    console.log(userDetails)
    console.log(isMatch)
    const token=await userDetails.generateAuthToken();
    console.log('token in log in ',token)
    res.cookie('gym',token,{
        expires:new Date(Date.now()+3000000)
    })
    console.log(`this is req ${req.cookies.jwt}`);
   
    

     
     if(isMatch){
         res.render('booking')
     }
     else{
         res.send('Invalid')
     }
    }
    catch(error){
        res.send('Invaldi login')
    }
})
app.post('/book',async(req,res)=>{
    try{
    console.log(req.body.five)
    console.log(req.body.six)
    console.log(`this is  ${req.cookies.gym}`)
    const token=req.cookies.gym;
    const verifyuser=jwt.verify(token,process.env.SECRET);
    const user=await Login.findOne({_id:verifyuser._id})
    console.log(user)
    console.log(`this is six ${req.body.six}`);
   const date=await user.addDateto(req.body.five);
   console.log(req.body.five);

   // res.send('Booking Done')
    res.render('home')
    }
    // if(req.body.six!=null){
    //     const addtime=new Login({
    //         time:req.body.six
    //     });
    //     addtime.save();
    catch(error){

    }
    }
    // if(req.body.six==null){
    //     console.log('six pealm na')
    // }

)


// const ism=async(password)=>{
//     const hp=bcrypt.hash(password,10)
//     console.log(hp)
//     const istrue=awit bcrypt.compare(password,hp)
//     console.log(istrue)

// }
// ism('shubham')


app.listen(port,()=>{
    console.log(`listning at port ${port}`);
})