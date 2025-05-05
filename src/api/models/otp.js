const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    otp:{type:Number},
    type:{type:String},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
},{timestamps:true})


module.exports = mongoose.model('otp',otpSchema)