const axios = require('axios');  
const geocoder = require('node-open-geocoder');
 // OpenStreetMap API endpoint
 const OSM_API_URL = 'https://nominatim.openstreetmap.org/search';

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
const getAllAddresses = (query) => {
    return new Promise((resolve, reject) => {
        const allAddresses = [];
        let page = 1;
        let hasNextPage = true;

        const fetchPage = () => {
            axios.get(OSM_API_URL, {
                params: { q: query, format: 'json', page }
            }).then(response => {
                const addresses = response.data.map(item => ({ address: item.display_name }));
                allAddresses.push(...addresses);

                // If there are more pages, continue fetching
                hasNextPage = response.headers['x-ratelimit-remaining'] > 0; // Check if there are remaining requests
                page++;

                if (hasNextPage) {
                    fetchPage(); // Fetch the next page
                } else {
                    resolve(allAddresses); // Resolve with the final result
                }
            }).catch(error => {
                console.error('Error:', error.message);
                reject(new Error('Failed to retrieve addresses')); // Reject with an error
            });
        };

        fetchPage(); // Start fetching the first page
    });
};





module.exports = {
    getAllAddresses, geocodeAddress, OSM_API_URL 
}