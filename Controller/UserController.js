const BadRequestError = require("../src/errors/BadRequestError");
const NotFoundError = require("../src/errors/NotFoundError");
const { getSingleAddress} = require('../Helpers/Constants');
const response = require("../src/services/api-response");
const parser = require("../src/services/request-validator");


const UserProfile= require("../models/UserProfile");

const saveUserLocation = async (req, res) => {
    const { address, category, userId, email } = req.body;

    const parsedAddress = parser('location',address).type('string').required().parseAndBuild(address);
    const parsedEmail = parser('email',email).email().required().parseAndBuild(email);
    const parsedCategory = parser('category',category).type('string').required().parseAndBuild(category);

   
    if (parsedCategory !== 'work' && parsedCategory !== 'home' && parsedCategory !== 'school' && parsedCategory !== 'highway') {
        return response.error(res, new BadRequestError("Invalid Category")); 
    } 
    try {
        const validatedAddress = await getSingleAddress(parsedAddress);
        if (!validatedAddress) {
            return response.error(res, new NotFoundError("Invalid Address")); 
        }

        let userProfile = await UserProfile.findOne({ userId });
        if (!userProfile) {
            // If user profile doesn't exist, create a new one
            userProfile = new UserProfile({ 
                userId:userId, email:parsedEmail, 
                locations: new Map([[parsedCategory, { address: parsedAddress }]])  });
        }else{
            userProfile.locations.set(parsedCategory, { address:parsedAddress });
        }
        await userProfile.save();

       return response.success(res, { message: 'Location Saved', userProfile }, 201);

    } catch (error) {
        return response.error(res, new BadRequestError(error.message)); 
    }
};

const updateUserLocation = async (req, res) => {
    const { address, category, userId } = req.body;

    const parsedAddress = parser('location',address).type('string').required().parseAndBuild(address);
    const parsedCategory = parser('category',category).type('string').required().parseAndBuild(category);

    try {
        // Check if user exists in the database
        const userProfile = await UserProfile.findOne({ userId });



        const validatedAddress = await getSingleAddress(parsedAddress);
        if (!validatedAddress) {
            return response.error(res, new NotFoundError("Invalid Address")); 
        }

        if (!userProfile) {
            return response.error(res, new NotFoundError("User does not Exist")); 
        }

        if (parsedCategory !== 'work' && parsedCategory !== 'home' && parsedCategory !== 'school' && parsedCategory !== 'highway') {
            return response.error(res, new BadRequestError("Invalid Category")); 
        }
                const locationKey = parsedCategory.toLowerCase();
                
        if (['home', 'work', 'highway', 'school'].includes(locationKey)) {
            userProfile.locations.set(category, { address });
        } else {
            return response.error(res, new BadRequestError("ERROR")); 
        }

        userProfile.timestamp = Date.now(); // Update timestamp

        // Save the updated user profile to the database
        await userProfile.save();

        return response.success(res, { message: 'User Profile Updated', userProfile }, 200);

    } catch (error) {
        //console.error('Error:', error.message);
        return response.error(res, error); 
    }
};

const getUserLocation = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find the user profile document in the database
        const userProfile = await UserProfile.findOne({ userId });

        // Check if user profile exists
        if (!userProfile) {
            return response.error(res, new NotFoundError("User does not Exist")); 
        }
        return response.success(res, { message: 'User Profile', userProfile }, 200);

    } catch (error) {
       // console.error('Error:', error.message);
       return response.error(res, error); 
    }
};

module.exports = {
    saveUserLocation,
    updateUserLocation,
    getUserLocation,
};