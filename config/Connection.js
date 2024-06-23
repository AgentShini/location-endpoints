const mongoose = require('mongoose');

const connectToDatabase = async (username, password) => {
    try {
        const connectionString = `mongodb+srv://${username}:${password}@cluster0.ta9pvbh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
        await mongoose.connect(connectionString);

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

const connectToTestDB = async (username, password) => {
    try {
        const connectionString = 'mongodb://localhost:27017/';
        await mongoose.connect(connectionString);

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};



module.exports = {connectToDatabase, connectToTestDB};
