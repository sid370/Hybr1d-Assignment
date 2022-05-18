const express = require('express')
const app=express()
const morgan = require("morgan")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const auth = require("./auth.js")

const conn = mongoose.connect(`mongodb+srv://Hybr1d:2y47eGtbBYitJpzd@cluster0.gjhxv.mongodb.net/Hybr1d?retryWrites=true&w=majority`,{
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

app.use((req,res,next)=>{
    res.status(404).json({
        status: 404,
        message: "Page not found"
    })
})

app.listen(3000)