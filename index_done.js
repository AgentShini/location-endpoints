
const express = require('express');
const axios = require('axios');
const geolib = require('geolib');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Dummy data store for user locations
let userHomeLocations = {};
let userWorkLocations = {};

// userHomeLocations['customer1'] = { latitude: 51.5074, longitude: -0.1278 }; // London
// userHomeLocations['customer2'] = { latitude: 40.7128, longitude: -74.0060 }; // New York


app.use(bodyParser.json());

// OpenStreetMap API endpoint
const OSM_API_URL = 'https://nominatim.openstreetmap.org/search';


// Function to format timestamp to a readable format
const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};


// Function to retrieve all addresses for a given query
const getAllAddresses = async (query) => {
    const allAddresses = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
        try {
            const response = await axios.get(OSM_API_URL, {
                params: { q: query, format: 'json', page }
            });

            const addresses = response.data.map(item => ({ address: item.display_name }));
            allAddresses.push(...addresses);

            // If there are more pages, continue fetching
            hasNextPage = response.headers['x-ratelimit-remaining'] > 0; // Check if there are remaining requests
            page++;
        } catch (error) {
            console.error('Error:', error.message);
            throw new Error('Failed to retrieve addresses');
        }
    }

    return allAddresses;
};


const geocodeAddress = async (address) => {
  try {
      const response = await axios.get(OSM_API_URL, {
          params: {
              q: address,
              format: 'json',
              limit: 1
          }
      });

      if (response.data.length === 0) {
          throw new Error('Address not found');
      }

      const location = response.data[0];
      return { latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) };
  } catch (error) {
      throw new Error('Failed to geocode address');
  }
};


// Endpoint to search for addresses  
app.get('/addresses', async (req, res) => { //DONE !!!!!!!!!!!!
    const query = req.query.query; // Get the search query from the request query parameters

    if (!query) {
        return res.status(400).json({ error: 'No query provided' });
    }

    try {
        const addresses = await getAllAddresses(query);
        res.json(addresses);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to retrieve addresses' });
    }
});



// Endpoint to save user home location
app.post('/user/home_location', async (req, res) => { //DONE !!!!!
    const { userId, address } = req.body;
  
    // Validate request body
    if (!userId || !address) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
        const { latitude, longitude } = await geocodeAddress(address);
        const homeLocation = { latitude, longitude, address };
        userHomeLocations[userId] = {homeLocation,timestamp:formatTimestamp(Date.now())};
        res.status(201).json({ message: 'User home location saved successfully', homeLocation });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to save user home location' });
    }
  });

// Endpoint to update user location
app.put('/user/home_location/:userId', async (req, res) => { //DONE !!!!!!!!!!!!
  const userId = req.params.userId;
  const { address } = req.body;

  // Validate request body
  if (!address) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if user exists
  if (!userHomeLocations[userId]) {
      return res.status(404).json({ error: 'User not found' });
  }

  try {
    const { latitude, longitude } = await geocodeAddress(address);
    const homeLocation = { latitude, longitude, address };
    userHomeLocations[userId] = {homeLocation,timestamp:formatTimestamp(Date.now())};
    res.status(201).json({ message: 'User home location saved successfully', homeLocation });
} catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to update user home location' });
}
});

// Endpoint to get user location
app.get('/user/home_location/:userId', (req, res) => {//DONE !!!!!!
  const userId = req.params.userId;

  // Check if user exists
  if (!userHomeLocations[userId]) {
      return res.status(404).json({ error: 'User not found' });
  }

  const location = userHomeLocations[userId];
  res.json({ userId, location });
});



// Endpoint to save user work location
app.post('/user/work_location', async (req, res) => {//DONE !!!!!!!!
    const { userId, address } = req.body;
  
    // Validate request body
    if (!userId || !address) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
        const { latitude, longitude } = await geocodeAddress(address);
        const workLocation = { latitude, longitude, address };
        userWorkLocations[userId] = {workLocation,timestamp:formatTimestamp(Date.now())};
        res.status(201).json({ message: 'User work location saved successfully', workLocation });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to save user work location' });
    }
  });

// Endpoint to update user location
app.put('/user/work_location/:userId', async (req, res) => {//DONE !!!!!
  const userId = req.params.userId;
  const { address } = req.body;

  // Validate request body
  if (!address) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if user exists
  if (!userWorkLocations[userId]) {
      return res.status(404).json({ error: 'User not found' });
  }

  try {
    const { latitude, longitude } = await geocodeAddress(address);
    const workLocation = { latitude, longitude, address };
    userWorkLocations[userId] = {workLocation,timestamp:formatTimestamp(Date.now())};
    res.status(201).json({ message: 'User work location saved successfully', workLocation });
} catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to update user work location' });
}
});

// Endpoint to get user location
app.get('/user/work_location/:userId', (req, res) => { //DONE !!!!!!
  const userId = req.params.userId;

  // Check if user exists
  if (!userWorkLocations[userId]) {
      return res.status(404).json({ error: 'User not found' });
  }

  const location = userWorkLocations[userId];
  res.json({ userId, location });
});


// Endpoint to calculate distance between rider and customer
app.get('/distance', (req, res) => {//DONE !!!!!
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
        // Convert distance from meters to kilometers (optional)
        const distanceInKm = geolib.convertDistance(distance, 'km');
  
        res.json({ distanceInMeters: distance, distanceInKm });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to calculate distance' });
    }
  });
  


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

