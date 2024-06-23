const express = require('express');
const router = express.Router();
const initializePayment = require('../Controller/PaymentController');
const DemandController = require("../Controller/DemandController");


router.put('/cancel_demand', DemandController.cancelDemand);
router.post('/scheduled_payment', initializePayment.acceptSchedulePayment);
router.post('/schedule_demand', DemandController.scheduleDemand);



  module.exports = router;