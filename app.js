const express = require('express')
const app=express()
const morgan = require("morgan")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const auth = require("./auth.js")
const seller = require("./sellers/seller")
const buyer = require("./buyers/buyer")
const dotenv = require("dotenv")
dotenv.config()

url=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_URI}/Hybr1d?retryWrites=true&w=majority`
const conn = mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
},error=>{
    if (!error) console.log("connected")
    else console.warn(error)
})

app.use(morgan("dev"))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.post("/api/auth/register",auth.signup)
app.post("/api/auth/login",auth.login)

app.use('/api/seller',seller)
app.use('/api/buyer',buyer)

app.use((req,res,next)=>{
    res.status(404).json({
        status: 404,
        message: "Page not found"
    })
})

app.listen(3000)