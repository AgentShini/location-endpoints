const NotFoundError = require("../src/errors/NotFoundError");
const AuthorizationError = require("../src/errors/AuthorizationError");
require('dotenv').config();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const https = require('https');
const Payment = require("../models/Payment");
const UserProfile = require("../models/UserProfile");
const Demand = require("../models/Scheduled_Demand");
const parser = require("../src/services/request-validator");
const response = require("../src/services/api-response"); 



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
        return response.error(res, new NotFoundError("Order does not Exist")); 
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
           // console.error('Error:', error.message);
           return response.error(res, error); 
          }
        });
      });
  
      request.on('error', (error) => {
        //console.error('Error:', error.message);
        return response.error(res, error); 
      });
  
      request.end();
    } catch (error) {
     // console.error('Error:', error.message);
     return response.error(res, error); 
    }
  },


  acceptSchedulePayment: async(req, res) => {
    try {

      const ID = req.body.ID

      const demand = await Demand.findOne({_id:ID})
      if(!demand){
        return response.error(res, new NotFoundError("Order does not Exist")); 
      }
      const userId = demand.userId;
      const userProfile = await UserProfile.findOne({ userId });
      if (!userProfile) {
        return response.error(res, new NotFoundError("User does not Exist")); 
    }

    if(demand.status == 'cancelled'){
      return response.error(res, new AuthorizationError("Order has been Cancelled"))
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
           // console.error('Error:', error.message);
           return response.error(res, error); 
          }
        })
      }).on('error', error => {
       // console.error(error)
      })
      clientReq.write(params)
      clientReq.end()
      
    } catch (error) {
     // console.error('Error:', error.message);
     return response.error(res, error); 
    }
  },


  acceptPayment: async(req, res) => {
    try {

      const { amount, userId, fuelType } = req.body;

      const parsedAmount = parser('amount',amount).type('integer').required().parseAndBuild(amount);
      const parsedFuelType = parser('fuelType',fuelType).type('string').required().parseAndBuild(fuelType);

      

      const userProfile = await UserProfile.findOne({userId});
      if (!userProfile) {
        return response.error(res, new NotFoundError("User does not Exist")); 
    }
    const email = userProfile.email;

      const params = JSON.stringify({
        "email": email,
        "amount": parsedAmount * 100
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
              amount:parsedAmount,
              userId:userId,
              fuelType:parsedFuelType,
              paystackReference:response.data.reference
            });

            await payment.save();
           return res.send(response.data.authorization_url);
      
          } catch (error) {
            return response.error(res, error); 
           // console.error('Error parsing response:', error.message);
          }
        })
      }).on('error', error => {
        return response.error(res, error); 
       // console.error(error)
      })
      clientReq.write(params)
      clientReq.end()
      
    } catch (error) {
    //  console.error('Error:', error.message);
    return response.error(res, error); 
  }
  },
}

const initializePayment = payStack;
module.exports = initializePayment;