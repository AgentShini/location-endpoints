require('dotenv').config();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const https = require('https');
const Payment = require("../models/Payment");
const UserProfile = require("../models/UserProfile");
const Demand = require("../models/Scheduled_Demand");


const payStack = {
 verifyPayment: async(req, res) => {
    try {
      const reference = req.params.reference;  
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/transaction/verify/${reference}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      };

      const payment = await Payment.findOne({paystackReference:reference});
      if(!payment){
        return res.status(404).json({message:"Reference does not exist"});
      }
  
      const request = https.request(options, (response) => {
        let data = '';
  
        response.on('data', (chunk) => {
          data += chunk;
        });
  
        response.on('end', async() => {
          try {
            const parsedData = JSON.parse(data);
            await payment.updateOne({status:parsedData.data.status});
            res.status(response.statusCode).json(parsedData);
          } catch (error) {
            res.status(500).json({ error: 'Failed to parse response from Paystack' });
          }
        });
      });
  
      request.on('error', (error) => {
        res.status(500).json({ error: error.message });
      });
  
      request.end();
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  },


  acceptSchedulePayment: async(req, res) => {
    try {

      const ID = req.body.ID
      const demand = await Demand.findOne({_id:ID})
      if(!demand){
        return res.status(404).json({ error: 'Order not found' });

      }
      const userId = demand.userId;
      const userProfile = await UserProfile.findOne({ userId });
      if (!userProfile) {
        return res.status(404).json({ error: 'User not found' });
    }

    if(demand.status == 'cancelled'){
      return res.status(403).json({error:'Order has been cancelled'});
    }

    const amount = demand.amount;
    const fuelType = demand.fuelType;
    const email = userProfile.email;

      const params = JSON.stringify({
        "email": email,
        "amount": amount * 100
      })
      // options
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
      // client request to paystack API
      const clientReq = https.request(options, apiRes => {
        let data = ''
        apiRes.on('data', (chunk) => {
          data += chunk
        });
        apiRes.on('end', async() => {
          try {
            const response = JSON.parse(data);
            
            const payment = new Payment({
              email:email,
              amount:amount,
              userId:userId,
              fuelType:fuelType,
              paystackReference:response.data.reference
            });

            await payment.save();
           return res.send(response.data.authorization_url);
      
          } catch (error) {
            console.error('Error parsing response:', error.message);
          }
        })
      }).on('error', error => {
        console.error(error)
      })
      clientReq.write(params)
      clientReq.end()
      
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  },


  acceptPayment: async(req, res) => {
    try {

      const amount = req.body.amount;
      const userId = req.body.userId;
      const fuelType = req.body.fuelType;

      

      const userProfile = await UserProfile.findOne({ userId });
      if (!userProfile) {
        return res.status(404).json({ error: 'User not found' });
    }
    const email = userProfile.email;

      const params = JSON.stringify({
        "email": email,
        "amount": amount * 100
      })
      // options
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
      // client request to paystack API
      const clientReq = https.request(options, apiRes => {
        let data = ''
        apiRes.on('data', (chunk) => {
          data += chunk
        });
        apiRes.on('end', async() => {
          try {
            const response = JSON.parse(data);
            
            const payment = new Payment({
              email:email,
              amount:amount,
              userId:userId,
              fuelType:fuelType,
              paystackReference:response.data.reference
            });

            await payment.save();
           return res.send(response.data.authorization_url);
      
          } catch (error) {
            console.error('Error parsing response:', error.message);
          }
        })
      }).on('error', error => {
        console.error(error)
      })
      clientReq.write(params)
      clientReq.end()
      
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  },
}

const initializePayment = payStack;
module.exports = initializePayment;