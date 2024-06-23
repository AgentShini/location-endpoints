const express = require('express');
const router = express.Router();
const DistanceController = require("../Controller/DistanceController");


// Endpoint to calculate distance between rider and customer
router.get('/distance', DistanceController.getDistance);


  module.exports = router;