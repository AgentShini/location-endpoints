const express = require('express');
const router = express.Router();
const geolib = require('geolib');


// Endpoint to calculate distance between rider and customer
router.get('/distance', (req, res) => {
    const { riderLocation, customerLocation } = req.body;
  
    // Validate request body
    if (!riderLocation || !customerLocation) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
  
    try {
  
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