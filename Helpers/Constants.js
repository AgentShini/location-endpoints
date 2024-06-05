const axios = require('axios');
const geocoder = require('node-geocoder'); // Assuming this is the correct library

// OpenStreetMap API endpoint (consider using a constant for clarity)
const nominatimUrl = 'https://nominatim.openstreetmap.org/search';

const geocoderOptions = {
  provider: 'osm', // Replace with your chosen provider if not OpenStreetMap
  timeout: 100000, // Set timeout in milliseconds (default is 30 seconds)
};

const geo = geocoder(geocoderOptions);

const geocodeAddress = async (address) => {
  try {
    const response = await geo.geocode(address);

    if (response.length === 0) {
      throw new Error('Address not found');
    }

    const { latitude, longitude } = response[0];
    return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
  } catch (error) {
    // Handle errors appropriately (e.g., log the error or throw a specific error)
    console.error('Geocoding error:', error.message);
    throw new Error('Geocoding failed'); // Or a more specific error message
  }
};
const getAllAddresses = async (query) => {
    try {
      const response = await geo.geocode(query);
  
      if (response.length === 0) {
        throw new Error('No addresses found for the given query');
      }
  
      const addresses = response.map(({ display_name }) => ({ address: display_name }));
      return addresses;
    } catch (error) {
      // Handle errors appropriately (e.g., log the error or throw a specific error)
      console.error('Geocoding error:', error.message);
      throw new Error('Failed to retrieve addresses'); // Or a more specific error message
    }
  };
  





module.exports = {
    getAllAddresses, geocodeAddress, OSM_API_URL 
}