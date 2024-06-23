const express = require('express');
const router = express.Router();
const UserController = require("../Controller/UserController");

router.post('/user/location', UserController.saveUserLocation);
router.put('/user/location', UserController.updateUserLocation);
router.get('/user/location/:userId', UserController.getUserLocation);


module.exports = router;