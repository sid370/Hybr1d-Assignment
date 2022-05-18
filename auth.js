const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const users = require("./models/users");

exports.signup = (req, res, next) => {
  users
    .find({ username: req.body.username })
    .exec()
    .then((response) => {
      console.log(response);
      if (response.length >= 1) {
        res.status(500).json({
          status: 500,
          message: "Username Unavailable",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              status: 500,
              message:
                "Some error ocurred. Please Change the password and try again",
              err: err,
            });
          } else {
            const newUser = new users({
              _id: mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash,
              userType: req.body.userType,
            });
            newUser
              .save()
              .then((response2) => {
                res.status(200).json({
                  status: 200,
                  message: "User created",
                });
              })
              .catch((error2) => {
                res.status(500).json({
                  status: 500,
                  message: "Some Error Occurred",
                  err: err,
                });
              });
          }
        });
      }
    });
};


exports.login=(req,res,next)=>{
    users.find({username: req.body.username})
    .exec()
    .then(response=>{
        if (response.length==0){
            res.status(401).json({
                status: 401,
                message: "Unauthorized"
            })
        }
        else{
            bcrypt.compare(req.body.password,response[0].password,(err,response2)=>{
                if (err)
                res.status(500).json({status:500, message:"Authentication Failed"})
                else if (response2){
                    const token = jwt.sign({username: req.body.username,date:Date.now(),userType:response[0].userType},"secret123",{expiresIn:"30m"});
                    res.status(200).json({
                        status: 200,
                        message: "Login Successful",
                        token: token
                    })
                }else{
                    res.status(500).json({
                        status: 500,
                        message: "Incorrect Password"
                    })
                }
            })
        }
    })
    .catch(err=>{
        res.status(500).json({status: 500, err:err})
    })
}