const express = require('express')
const bcrypt = require("bcryptjs")
const bodyParser = require("body-parser")
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const user = require('./models/user')
require('dotenv').config()

const app = express() //by creating object ,we create a server
app.use(express.json())//to let node server know that data from frontend is json format
app.set("view engine", "ejs")//setting the views 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

//import mongoose
const mongoose = require('mongoose')
//connect with db
mongoose.connect(process.env.Mongo_uri);
//get connection
const db = mongoose.connection;
//check whether connection is success
db.once('open', () => {
    console.log('connection is sucessfully')
    //db.collections gives us object value pairs and Object.keys gives us keys of object
    const collectionArr = Object.keys(db.collections)
    console.log(collectionArr)
})

db.on('error', (error) => {
    console.log(error)
})

app.get('/', (req, res) => {
    // res.status(200).json({ message: 'hello ,welcome to mother earth' })
    // verify authorisation of token
    const {token}=req.cookies;
    if(token) {
        const tokenStatus=jwt.verify(token,process.env.Jwt_secret_key)
        if(tokenStatus.type=='user') {
            res.render('home')
        }else{
            res.redirect('/signin')
        }
    }
    else{
        res.redirect('/signin')
    }
    
})
app.get('/signin', (req, res) => {
    res.render('signin')
})
app.get('/signup', (req, res) => {
    res.render('signup')
})
app.post('/signup', async (req, res) => {
    const { name, email, password: plainTextPassword } = req.body
    console.log(req.body)
    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hashSync(plainTextPassword, salt)
    try {
        await user.create({
            name,
            email,
            password: encryptedPassword
        });
        res.redirect('/signin')
    } catch (error) {
        console.log(error)
    }

})
app.post('/signin', async (req, res) => {
    const { email, password } = req.body
    const userObj = await user.findOne({ email })
    if (!userObj) {
        res.send({ error: 'user not found', status: 404 })
    }
    const passwordStatus = await bcrypt.compare(password, userObj.password)
    if (passwordStatus) {
        console.log('user entered password', password)
        console.log('registered password', userObj.password)
        const token = jwt.sign({ //jwt token
            userId: userObj._id,
            email: email,
            type: 'user'
        }, process.env.Jwt_secret_key, { expiresIn: '2h' })
        //cookie
        res.cookie('token', token, { maxAge: 2 * 60 * 60 * 1000 })
        res.redirect('/')
    } else {
        res.send({ error: 'wrong credentials entered', status: 500 })
    }

})

const Router = require('./routes/user')
app.use('/users', Router)
app.listen(3000)
console.log('server is listening')