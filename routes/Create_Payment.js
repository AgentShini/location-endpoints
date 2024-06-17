const express = require('express');
const router = express.Router();

const initializePayment = require('../Controller/PaymentController');

router.post('/create_payment', initializePayment.acceptPayment);
router.get('/verify_payment/:reference',initializePayment.verifyPayment)


module.exports = router;
