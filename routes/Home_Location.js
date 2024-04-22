const express = require('express');
const router = express.Router();
const HomeLocation = require("../models/HomeLocation");
const {geocodeAddress} = require("../Helpers/Constants");


// Endpoint to save user home location
router.post('/user/home_location', async (req, res) => {
    const { userId, address } = req.body;
  
    // Validate request body
    if (!userId || !address) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
        const { latitude, longitude } = await geocodeAddress(address);
         // Create a new user home location document
         const newHomeLocation = new HomeLocation({
            userId,
            latitude,
            longitude,
            address,
            timestamp:Date.now()
        });
        await newHomeLocation.save();

        res.status(201).json({ message: 'User home location saved successfully', newHomeLocation });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to save user home location' });
    }
  });

// Endpoint to update user location
router.put('/user/home_location/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { address } = req.body;

  // Validate request body
  if (!address) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if user exists in the database
    const existingUserLocation = await HomeLocation.findOne({ userId });

    if (!existingUserLocation) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Geocode the new address to get latitude and longitude
    const { latitude, longitude } = await geocodeAddress(address);

    // Update user home location fields
    existingUserLocation.address = address;
    existingUserLocation.latitude = latitude;
    existingUserLocation.longitude = longitude;
    existingUserLocation.timestamp = Date.now(); // Update timestamp

    // Save the updated user home location document to the database
    await existingUserLocation.save();
    res.status(201).json({ message: 'User home location updated successfully', HomeLocation:existingUserLocation  });
} catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to update User home location' });
}
});

// Endpoint to get user location
router.get('/user/home_location/:userId', async(req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user home location document in the database
    const userLocation = await HomeLocation.findOne({ userId });

    // Check if user location exists
    if (!userLocation) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({ userId, location: userLocation });
} catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve user home location' });
}
});



module.exports = router;