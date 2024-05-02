const axios = require('axios');  
 // OpenStreetMap API endpoint
const OSM_API_URL = 'https://nominatim.openstreetmap.org/search';
const geocoder = require('node-open-geocoder');

const geocodeAddress = (address) => {
    return new Promise((resolve, reject) => {
        geocoder()
            .geocode(address)
            .end((err, result) => {
                if (err) {
                    reject(new Error('Failed to geocode address'));
                } else if (result.length === 0) {
                    reject(new Error('Address not found'));
                } else {
                    const { lat, lon } = result[0];
                    resolve({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
                }
            });
    });
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