const BadRequestError = require("../src/errors/BadRequestError");
const NotFoundError = require("../src/errors/NotFoundError");
const UserProfile = require("../models/UserProfile");
const Demand = require("../models/Scheduled_Demand");
const { getSingleAddress } = require('../Helpers/Constants');
const parser = require("../src/services/request-validator");
const response = require("../src/services/api-response"); 


const scheduleDemand = async (req, res) => {
    const { userId, location, proposedDateTime, amount, fuelType } = req.body;

    const parsedLocation = parser('location',location).type('string').required().parseAndBuild(location);
    const parsedAmount = parser('amount',amount).type('integer').required().parseAndBuild(amount);
    const parsedFuelType = parser('fuelType',fuelType).type('string').required().parseAndBuild(fuelType);
    const parsedDate = parser('proposedDateTime',proposedDateTime).type('date').required().parseAndBuild(proposedDateTime);




    const validatedAddress = await getSingleAddress(parsedLocation);
    if (!validatedAddress) {
        return response.error(res, new NotFoundError("Invalid Address")); 
    }

    const userProfile = await UserProfile.findOne({ userId });

    // Check if user profile exists
    if (!userProfile) {
        return response.error(res, new NotFoundError("User does not Exist")); 
    }

    try {

        const demand = new Demand({
            userId:userId,
            location:parsedLocation,
            proposedDateTime: new Date(parsedDate),
            amount:parsedAmount,
            fuelType:parsedFuelType
        });

        await demand.save();

        return response.success(res, { message: 'Order successful', demand }, 201);
    } catch (error) {
       // console.error('Error:', error.message);
       return response.error(res, error); 
    }
};

const cancelDemand = async (req, res) => {
    const { ID } = req.body;

    if (!ID) {
        return response.error(res, new BadRequestError("Missing ID")); 
    }

    try {
        const demand = await Demand.findOne({ _id: ID });

        if (!demand) {
            return response.error(res, new NotFoundError("Order does not Exist")); 
        }
        await demand.updateOne({ status: 'cancelled' });
         return response.success(res, { message: 'Order Cancelled'}, 200);
    } catch (error) {
      //  console.error('Error:', error.message);
      return response.error(res, error); 
    }
};

module.exports = {
    scheduleDemand,
    cancelDemand
};