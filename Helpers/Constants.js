//const jwt = require('jsonwebtoken');
const Demand = require('../models/Scheduled_Demand')
const opencage = require('opencage-api-client');

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
      console.error('Error:', error.message);
    }

    const addresses = data.map(item => ({
      address: item.formatted
    }));

    return addresses;
  } catch (error) {
    console.error('Error:', error.message);
    //throw new Error( error.message); // Re-throw for route handler
  }
};

const getSingleAddress = async (query) => {
  try {
    const response = await opencage.geocode({ q: query, countrycode: 'ng', limit: 1 });

    const data = response.results;

    if (data.length === 0) {
      console.error('Error:', error.message);
    }

    const address = {
      address: data[0].formatted
    };

    return address;
  } catch (error) {
    console.error('Error:', error.message);
    //throw new Error( error.message); // Re-throw for route handler
  }
};



function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing JWT token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
    req.userID = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid JWT token' });
  }
}



async function scheduleDemand(userId, location, proposedDateTime, amount, fuelType) {
  try {
    
    const demand = new Demand({
      userId,
      location,
      proposedDateTime: new Date(proposedDateTime),
      amount,
      fuelType
    });

    await demand.save();

    return { message: 'Demand scheduled successfully', demand };
  } catch (error) {
    console.error('Error scheduling demand:', error.message);
  }
}











module.exports = {
    getAllAddresses, haversineDistance, getSingleAddress,geocodeAddress, verifyJWT,scheduleDemand,
}