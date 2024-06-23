const {geocodeAddress,haversineDistance} = require("../Helpers/Constants");
const parser = require("../src/services/request-validator");


const getDistance = async (req, res) => {
    const { address1, address2 } = req.query;

    const parsedAddress1 = parser('address1',address1).type('string').required().parseAndBuild(address1);
    const parsedAddress2 = parser('address2',address2).type('string').required().parseAndBuild(address2);

  
    try {
        const location1 = await geocodeAddress(parsedAddress1);
        const location2 = await geocodeAddress(parsedAddress2);
      
        if (location1 && location2) {
            const distance = haversineDistance(location1, location2);
            res.json({
                address1: location1.formatted,
                address2: location2.formatted,
                distance: `${distance.toFixed(2)} kilometers`
            });
        } else {
            return response.error(res, new BadRequestError("ERROR")); 
        }
    } catch (error) {
       // console.error('Error:', error.message);
       return response.error(res, error); 
    }
};

module.exports = {
    getDistance,
};