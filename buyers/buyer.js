const mongoose = require("mongoose");
const express = require("express");
const Router = express.Router();
const middleware_auth = require("../middleware/middleware_auth");
const sellers = require("../models/seller");

validateBuyer = (details) => {
  if (details !== "buyer") return false;
  else return true;
};

Router.get("/list-of-sellers", middleware_auth, (req, res, next) => {
  validated = validateBuyer(req.body.userDetails.userDetails.userType);

  if (!validated)
    res.status(404).json({
      status: 404,
      message: "Access Denied",
    });

  sellers
    .find({}, "_id username")
    .exec()
    .then((response) => {
      res.status(200).json({
        status: 200,
        sellers: response,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: 500,
        message: "Some Error Occured",
      });
    });
});

Router.get("/seller-catalog/:seller_id", middleware_auth, (req, res, next) => {
  validated = validateBuyer(req.body.userDetails.userDetails.userType);

  if (!validated)
    res.status(404).json({
      status: 404,
      message: "Access Denied",
    });

  sellers
    .findOne({ _id: req.params.seller_id })
    .exec()
    .then((response) => {
      res.status(200).json({
        status: 200,
        catalog: response.catalog,
      });
    });
});

Router.post("/create-order/:seller_id", middleware_auth, (req, res, next) => {
  validated = validateBuyer(req.body.userDetails.userDetails.userType);

  if (!validated)
    res.status(404).json({
      status: 404,
      message: "Access Denied",
    });

  sellers
    .findOne({ _id: req.params.seller_id })
    .exec()
    .then((response) => {
      console.log("Finder: ",response);
      if (response == null || response.length < 1) {
        return res.status(404).json({
          status: 404,
          message: "Invalid Seller",
        });
      }
    });

  req.body.orders.push({ consumerId: req.body.userDetails.userDetails._id });
  sellers
    .updateOne(
      { _id: req.params.seller_id },
      { $push: { orders: req.body.orders } }
    )
    .exec()
    .then((response) => {
      res.status(200).json({
        status: 200,
        message: "Order Placed",
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: 500,
        message: "Some Error Occured",
        err,
      });
    });
});

module.exports = Router;
