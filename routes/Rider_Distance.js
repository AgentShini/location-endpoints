const express = require('express');
const router = express.Router();
const geolib = require('geolib');
const {geocodeAddress} = require("../Helpers/Constants");


// Endpoint to calculate distance between rider and customer
router.get('/distance', async(req, res) => {
    const { riderAddress, customerAddress } = req.body;

    // Validate request body
    if (!riderAddress || !customerAddress) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    
  
    try {
        // Geocode rider and customer addresses
        const riderLocation = await geocodeAddress(riderAddress);
        const customerLocation = await geocodeAddress(customerAddress);

        // Calculate distance between geocoded locations
        const distance = geolib.getDistance(
            { latitude: riderLocation.latitude, longitude: riderLocation.longitude },
            { latitude: customerLocation.latitude, longitude: customerLocation.longitude }
        );

        // Convert distance from meters to kilometers
        const distanceInKm = geolib.convertDistance(distance, 'km');

        res.json({ distanceInMeters: distance, distanceInKm });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to calculate distance' });
    }
  });


  module.exports = router;