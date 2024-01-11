 const mongoose=require('mongoose')
 let userSchema=new mongoose.Schema({
    //explaining type of field 
    // userName:{
    //     type:String,
    //     required:true
    // }
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
 });
 module.exports=mongoose.model('Users',userSchema)