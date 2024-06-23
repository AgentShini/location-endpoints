//const jwt = require('jsonwebtoken');
const opencage = require('opencage-api-client');
const NotFoundError = require('../src/errors/NotFoundError');


const geocodeAddress = async (address) => {
  try {
    const data = await opencage.geocode({ q: address });
    if (data.status.code === 200 && data.results.length > 0) {
      const place = data.results[0];
      return {
        formatted: place.formatted,
        latitude: place.geometry.lat,
        longitude: place.geometry.lng,
        timezone: place.annotations.timezone.name
      };
    } else {
      console.log('Status', data.status.message);
      console.log('total_results', data.total_results);
      return null;
    }
  } catch (error) {
    console.log('Error', error.message);
    if (error.status && error.status.code === 402) {
      console.log('Hit free trial daily limit');
      console.log('Become a customer: https://opencagedata.com/pricing');
    }
    return null;
  }
};

const haversineDistance = (coords1, coords2) => {
  const toRadians = (degree) => degree * (Math.PI / 180);

  const lat1 = toRadians(coords1.latitude);
  const lon1 = toRadians(coords1.longitude);
  const lat2 = toRadians(coords2.latitude);
  const lon2 = toRadians(coords2.longitude);

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const R = 6371; // Earth's radius in kilometers
  return R * c;
};


const getAllAddresses = async (query) => {
  try {
    const response = await opencage.geocode({ q: query, countrycode: 'ng', limit: 100 });

    const data = response.results;

    if (data.length === 0) {
      // error('Error:', error.message);
      throw new NotFoundError('Address not Found')

    }

    const addresses = data.map(item => ({
      address: item.formatted
    }));

    return addresses;
  } catch (error) {
   throw new NotFoundError(error.message)
  }
};

const getSingleAddress = async (query) => {
  try {
    const response = await opencage.geocode({ q: query, countrycode: 'ng', limit: 1 });

    const data = response.results;

    if (data.length === 0) {
      //throw new NotFoundError('Address not Found')
    }

    const address = {
      address: data[0].formatted
    };

    return address;
  } catch (error) {
    //throw new NotFoundError(error.message)
    //console.error('Error:', error.message);
  }
};




module.exports = {
    getAllAddresses, haversineDistance, getSingleAddress,geocodeAddress
}