const mongoose = require("mongoose");
const express = require("express");
const middleware_auth = require("../middleware/middleware_auth");
const Router = express.Router();
const sellers = require("../models/seller");

Router.post("/create-catalog", middleware_auth, (req, res, next) => {
  if (req.body.userDetails.userDetails.userType !== "seller") {
    return res.status(404).json({
      status: 404,
      message: "Not Authorized",
    });
  }
  product = {
    name: req.body.name,
    price: req.body.price,
  };
  sellers.updateOne(
    { _id: req.body.userDetails.userDetails._id },
    { $push: { catalog: product } },
    (err, resp3) => {
      if (err)
        return res.status(500).json({
          status: 500,
          message: "Error Occured in udating",
          err,
        });
      return res.status(200).json({
        status: 200,
        message: "Products Added",
        resp3,
      });
    }
  );
});

Router.get("/orders", middleware_auth, (req, res, next) => {
  if (req.body.userDetails.userDetails.userType !== "seller") {
    return res.status(404).json({
      status: 404,
      message: "Not Authorized",
    });
  }
  sellers
    .findOne({ _id: req.body.userDetails.userDetails._id })
    .exec()
    .then((response) => {
      res.status(200).json({
        status: 200,
        orders: response.orders,
      });
    });
});

module.exports = Router;
