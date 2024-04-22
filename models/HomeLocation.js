const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HomeLocationSchema = new Schema({
    userId: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HomeLocation',HomeLocationSchema);