const express = require('express');
const router = express.Router();
const UserProfile = require("../models/UserProfile");
const Demand = require("../models/Scheduled_Demand");
const initializePayment = require('../Controller/PaymentController');
const { getSingleAddress } = require('../Helpers/Constants');


router.put('/cancel_demand',async(req,res)=>{
  const {ID} = req.body;
  if(!ID){
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const demand = await Demand.findOne({_id:ID});
  if(!demand){
    return res.status(404).json({ error: 'Scheduled Demand does not exist' });
  }
  await demand.updateOne({status:'cancelled'});
  return res.status(200).json({message:'Scheduled Demand Cancelled'})
})

  router.post('/scheduled_payment', initializePayment.acceptSchedulePayment);



router.post('/schedule_demand', async (req, res) => {
  const { userId, location, proposedDateTime, amount, fuelType } = req.body;


  // Validate required fields
  if (!location || !proposedDateTime || !userId || !amount || !fuelType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const validatedAddress = await getSingleAddress(location);
  if (!validatedAddress) {
    return res.status(400).json({ error: 'Invalid address' });
  }

  try {

    const userProfile = await UserProfile.findOne({ userId });

        if (!userProfile) {
            return res.status(404).json({ error: 'User not found' });
        }

    const demand = new Demand({
      userId,
      location,
      proposedDateTime: new Date(proposedDateTime),
      amount,
      fuelType
    });

    await demand.save();

    res.status(201).json({ message: 'Demand scheduled successfully', demand });
  } catch (error) {
    console.error('Error scheduling demand:', error.message);
    res.status(500).json({ error: 'Failed to schedule demand' });
  }
});


  module.exports = router;