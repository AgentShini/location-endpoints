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
        geocoder()
            .geocode(query)
            .end((err, result) => {
                if (err) {
                    reject(new Error('Failed to retrieve addresses'));
                } else {
                    const addresses = result.map(item => ({ address: item.display_name }));
                    resolve(addresses);
                }
            });
    });
};





module.exports = {
    getAllAddresses, geocodeAddress, OSM_API_URL 
}