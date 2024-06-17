const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  fuelType: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default:Date.now()
  },
  paystackReference: {
    type: String,
    required: true,
    unique:true,
  },
  email:{
    type:String,
    required:true
  },
  status:{
    type:String,
    required:true,
    default:"pending"
  },
  timestamp:{
    type:Date,
    default:Date.now()
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
