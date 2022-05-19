const mongoose = require("mongoose");

const seller = mongoose.Schema(
  {
    _id: String,
    username:String,
    catalog: Array,
    orders: Array
  },
  { versionKey: false }
);

module.exports=mongoose.model('Sellers',seller) 