
const express=require('express')
const Router=express.Router()
const Users=require('../models/user.js')
//to get all users data
Router.get('/',async (req,res)=>{
    // console.log(req.query)
    try{
        const usersData=await Users.find()
        res.json({message:usersData})
    }catch(err) {
        res.status(500).json({message:err})
    }
    
})
Router.get('/achuthkumar',(req,res)=>{
    res.json({message:'authenticated user arrived'})
})
//to get specific user data
Router.get('/:id', async (req,res)=>{
    
    try{
        let specificUser=await Users.findById(req.params.id)
        if(specificUser) {
            res.json({data:specificUser})
        }
        else{
            res.status(404).json({error:'user not found'})
        }
        
    } 
    catch(err){
        res.status(500).json({error:'error occured'})
    }
   
})
//to create user
Router.post('/new',async (req,res)=>{
    //created user in db
    // console.log(req.body)//printing data that is posted
    const newUser=new Users({userName:req.body.userName})
     await newUser.save()
    res.status(200).json({message:'new user created sucessfully'})
})
//to update user
Router.put('/update/:id',(req,res)=>{
    //update user in db
    console.log(req.params)
    console.log(req.body)//printing data that is updated
    res.status(200).json({message:'data updated sucessfully'})
})
//to update user but only that specific field instead of that whole object
Router.patch('/update/:id',async (req,res)=>{
    
    let user=await Users.findById(req.params.id)
    user.userName=req.body.userName
    await user.save()
    res.status(200).json({message:'data patched sucessfully'})
})
//to delete user
Router.delete('/delete/:id',async (req,res)=>{
    //delete user in db
    await Users.findOneAndDelete({ _id: req.params.id })
    res.status(200).json({message:'user deleted'})
    // let user =await Users.findById(req.params.id)
    // res.status(200).json({message:user})
})

module.exports=Router