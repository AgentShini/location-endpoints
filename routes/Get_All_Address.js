const express = require('express');
const router = express.Router();
const AddressController = require("../Controller/AddressController");


// Endpoint to search for all addresses  
router.get('/addresses', AddressController.getAddresses);


module.exports = router;