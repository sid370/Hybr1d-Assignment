const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    _id: String,
    username: {type: String, unique: true, require: true},
    password: {type: String,require:true},
    userType: {type: String,require: true}
},
{ versionKey: false })

module.exports = mongoose.model('Users',userSchema)