const express = require('express');
const router = express.Router();
const {getAllAddresses} = require("../Helpers/Constants");


// Endpoint to search for all addresses  
router.get('/addresses',(req, res) => {
    const query = req.query.query; // Get the search query from the request query parameters

    if (!query) {
        return res.status(400).json({ error: 'No query provided' });
    }

    getAllAddresses(query)
    .then(addresses => {
        res.json(addresses);
    })
    .catch(error => {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to retrieve addresses' });
    });

});


module.exports = router;