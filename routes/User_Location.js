const express = require('express');
const router = express.Router();
const UserProfile= require("../models/UserProfile");
const { verifyJWT, getSingleAddress } = require('../Helpers/Constants');



// Endpoint to save user home location
router.post('/user/location', async (req, res) => {
    //router.post('/user/location',verifyJWT, async (req, res) => {

    //const userId = req.userID;
   // const token = req.headers.authorization.split(' ')[1];
    const {  address, category, userId, email } = req.body;

    // Validate request body
    if (!userId || !address || !category || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (category !== 'work' && category !== 'home' && category !== 'school' && category  !== 'highway') {
        return res.status(400).json({ error: 'Unsupported Category' });
    }

    try {

        const validatedAddress = await getSingleAddress(address);
    if (!validatedAddress) {
      return res.status(400).json({ error: 'Invalid address' });
    }


        let userProfile = await UserProfile.findOne({ userId });

        if (!userProfile) {
            // If user profile doesn't exist, create a new one
            userProfile = new UserProfile({ userId , email , locations: new Map() });
        }

        // If locations field doesn't exist, initialize it
        if (!userProfile.locations) {
            userProfile.locations = new Map();
        }

            userProfile.locations.set(category, { address });
            // const data = {
        //     address,category,userId
        // }       
         await userProfile.save();
        //  const response = await axios.post('YOUR_TARGET_URL',data, {
        //     headers: {
        //       Authorization: `Bearer ${token}`
        //     }
        //   });
       // console.log('Target URL response:', response.data);
        res.status(201).json({ message: 'User Profile', userProfile });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to update user location
router.put('/user/location', async (req, res) => {
    //router.put('/user/location',verifyJWT, async (req, res) => {

   // const userId = req.userID;
    //const token = req.headers.authorization.split(' ')[1];
    const { address, category, userId} = req.body;

    // Validate request body
    if (!address || !category || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Check if user exists in the database
        const userProfile = await UserProfile.findOne({ userId });

    const validatedAddress = await getSingleAddress(address);
    if (!validatedAddress) {
      return res.status(400).json({ error: 'Invalid address' });
    }

        if (!userProfile) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update or set the location based on category
        const locationKey = category.toLowerCase();
        if (['home', 'work','highway','school'].includes(locationKey)) {
            userProfile.locations.set(category, { address });
        } else {
            return res.status(400).json({ error: 'Unsupported category' });
        }

        userProfile.timestamp = Date.now(); // Update timestamp

        // const data = {
        //     address,category,userId
        // }      
        // Save the updated user profile to the database
        await userProfile.save();
        // const response = await axios.post('YOUR_TARGET_URL',data, {
        //     headers: {
        //       Authorization: `Bearer ${token}` 
        //     }
        //   });  
        //  console.log('Target URL response:', response.data);
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