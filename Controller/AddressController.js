const BadRequestError = require("../src/errors/BadRequestError");
const {getAllAddresses} = require("../Helpers/Constants");
const response = require("../src/services/api-response"); 



const getAddresses = async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return response.error(res, new BadRequestError("Missing Query")); 
    }

    try {
        const addresses = await getAllAddresses(query);
        res.json(addresses);
    } catch (error) {
        return response.error(res, error); 
    }
};

module.exports = {
    getAddresses,
};
