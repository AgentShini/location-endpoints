const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserProfile = new Schema({
    userId: { type: String, required: true },

    locations: {
      type: Map,
      of: {
          address: { type: String, required: true }
      }
  },


      timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProfile',UserProfile);