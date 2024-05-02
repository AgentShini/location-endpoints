
const axios = require('axios');   // OpenStreetMap API endpoint
const OSM_API_URL = 'https://nominatim.openstreetmap.org/search';

const geocodeAddress = async (address) => {
    try {
        const apiUrl = `http://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
        const response = await axios.get(apiUrl);

        if (response.data.length === 0) {
            throw new Error('Address not found');
        }

        const { lat, lon } = response.data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } catch (error) {
        throw new Error('Failed to geocode address');
    }
};
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





module.exports = {
    getAllAddresses, geocodeAddress, OSM_API_URL 
}