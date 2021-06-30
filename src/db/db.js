const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/gym',
{useUnifiedTopology: true, useNewUrlParser: true ,useCreateIndex:true}).then(()=>{
    console.log('connected succesfully');
}).catch((e)=>{
    console.log('Error during connection with MongoDB')
});