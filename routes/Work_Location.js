const express = require('express');
const router = express.Router();
const WorkLocation = require("../models/WorkLocation");
const {geocodeAddress,formatTimestamp} = require("../Helpers/Constants");



// Endpoint to save user work location
router.post('/user/work_location', async (req, res) => {//DONE !!!!!!!!
    const { userId, address } = req.body;
  
    // Validate request body
    if (!userId || !address) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
        const { latitude, longitude } = await geocodeAddress(address);
        const newWorkLocation = new WorkLocation({
            userId,
            latitude,
            longitude,
            address,
            timestamp:formatTimestamp(Date.now())
        });
        await newWorkLocation.save();
        res.status(201).json({ message: 'User work location saved successfully', newWorkLocation });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to save user work location' });
    }
  });

// Endpoint to update user location
router.put('/user/work_location/:userId', async (req, res) => {//DONE !!!!!
  const userId = req.params.userId;
  const { address } = req.body;

  // Validate request body
  if (!address) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if user exists in the database
    const existingUserLocation = await WorkLocation.findOne({ userId });

    if (!existingUserLocation) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Geocode the new address to get latitude and longitude
    const { latitude, longitude } = await geocodeAddress(address);

    // Update user home location fields
    existingUserLocation.address = address;
    existingUserLocation.latitude = latitude;
    existingUserLocation.longitude = longitude;
    existingUserLocation.timestamp = formatTimestamp(Date.now()); // Update timestamp

    // Save the updated user home location document to the database
    await existingUserLocation.save();
    res.status(201).json({ message: 'User work location updated successfully', WorkLocation:existingUserLocation  });
}  catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to update user work location' });
}
});

// Endpoint to get user location
router.get('/user/work_location/:userId', async(req, res) => { //DONE !!!!!!
  const userId = req.params.userId;

  try {
    // Find the user home location document in the database
    const userLocation = await WorkLocation.findOne({ userId });

    // Check if user location exists
    if (!userLocation) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({ userId, location: userLocation });
} catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve user work location' });
}
});

module.exports = router;