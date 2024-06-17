const mongoose = require('mongoose');

const demandSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true
  },
  proposedDateTime: {
    type: Date,
    required: true,
    
  },
  amount: {
    type: Number,
    required: true
  },
  fuelType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending' // Pending, Confirmed, Cancelled, etc.
  },
  date:{
    type:Date,
    default:Date.now()
  }
});

module.exports = mongoose.model('Demand', demandSchema);
