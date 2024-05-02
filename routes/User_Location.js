const express = require('express');
const router = express.Router();
const UserProfile= require("../models/UserProfile");
const {geocodeAddress} = require("../Helpers/Constants");



// Endpoint to save user home location
router.post('/user/location', async (req, res) => {
    const { userId, address, category } = req.body;

    // Validate request body
    if (!userId || !address || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (category !== 'work' && category !== 'home') {
        return res.status(400).json({ error: 'Unsupported Category' });
    }

    try {
        const { latitude, longitude } = await geocodeAddress(address);


        let userProfile = await UserProfile.findOne({ userId });

        if (!userProfile) {
            // If user profile doesn't exist, create a new one
            userProfile = new UserProfile({ userId, locations: new Map() });
        }

        // If locations field doesn't exist, initialize it
        if (!userProfile.locations) {
            userProfile.locations = new Map();
        }

        userProfile.locations.set(category, { latitude, longitude, address });
        await userProfile.save();
        res.status(201).json({ message: 'User Profile', userProfile });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to save user profile' });
    }
});

// Endpoint to update user location
router.put('/user/location', async (req, res) => {
    const { address, category, userId } = req.body;

    // Validate request body
    if (!address || !category || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Check if user exists in the database
        let userProfile = await UserProfile.findOne({ userId });

        if (!userProfile) {
            return res.status(404).json({ error: 'User not found' });
        }

         // Geocode the new address to get latitude and longitude
         const { latitude, longitude } = await geocodeAddress(address);

        // Update or set the location based on category
        const locationKey = category.toLowerCase();
        if (['home', 'work'].includes(locationKey)) {
            userProfile.locations.set(category, { latitude, longitude, address });
        } else {
            return res.status(400).json({ error: 'Unsupported category' });
        }

        userProfile.timestamp = Date.now(); // Update timestamp

        // Save the updated user profile to the database
        await userProfile.save();

        res.status(200).json({ message: 'User Profile updated successfully', userProfile });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to update User Profile' });
    }
});


// Endpoint to get user location
router.get('/user/location/:userId', async(req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user home location document in the database
    const userProfile = await UserProfile.findOne({ userId });

    // Check if user location exists
    if (!userProfile) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({ userId, UserProfile: userProfile });
} catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve User Profile' });
}
});



module.exports = router;