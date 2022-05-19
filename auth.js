const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const users = require("./models/users");
const sellers = require("./models/seller")

add2seller=async (details)=>{
  return new Promise((resolve,reject)=>{
    const newSeller = new sellers({
      _id: details._id,
      username: details.username,
      catalog: [],
      orders: []
    });
    newSeller
      .save()
      .then((resp2) => {
        console.log("Seller Created: ", resp2)
        resolve()
      })
      .catch((err) => {
        reject(err)
      });
  })
}

exports.signup = (req, res, next) => {
  users
    .find({ username: req.body.username })
    .exec()
    .then((response) => {
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
              .then(async (response2) => {
                if (response2.userType==="seller")
                add_to_seller = await add2seller(response2).then(response=>console.log(response)).catch(error=>{
                  return res.status(500).json({
                    status: 500,
                    message: error
                  })
                })
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

exports.login = (req, res, next) => {
  users
    .find({ username: req.body.username })
    .exec()
    .then((response) => {
      if (response.length == 0) {
        res.status(401).json({
          status: 401,
          message: "Unauthorized",
        });
      } else {
        bcrypt.compare(
          req.body.password,
          response[0].password,
          (err, response2) => {
            if (err)
              res
                .status(500)
                .json({ status: 500, message: "Authentication Failed" });
            else if (response2) {
              const token = jwt.sign(
                {
                  date: Date.now(),
                  userDetails: response[0]
                },
                "secret123",
                { expiresIn: "30m" }
              );
              res.status(200).json({
                status: 200,
                message: "Login Successful",
                token: token,
              });
            } else {
              res.status(500).json({
                status: 500,
                message: "Incorrect Password",
              });
            }
          }
        );
      }
    })
    .catch((err) => {
      res.status(500).json({ status: 500, err: err });
    });
};
