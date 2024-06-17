const express = require('express');
const router = express.Router();
const {geocodeAddress,haversineDistance} = require("../Helpers/Constants");


// Endpoint to calculate distance between rider and customer
router.get('/distance', async (req, res) => {
    const { address1, address2 } = req.query;
  
    if (!address1 || !address2) {
      return res.status(400).json({ error: 'Please provide both address1 and address2 query parameters' });
    }
  
    const location1 = await geocodeAddress(address1);
    const location2 = await geocodeAddress(address2);
  
    if (location1 && location2) {
      const distance = haversineDistance(location1, location2);
      res.json({
        address1: location1.formatted,
        address2: location2.formatted,
        distance: `${distance.toFixed(2)} kilometers`
      });
    } else {
      res.status(500).json({ error: 'Failed to retrieve one or both addresses' });
    }
  });


  module.exports = router;