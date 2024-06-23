require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var getAllAddresses = require("./routes/Get_All_Address");
var userLocation = require("./routes/User_Location");
var riderDistance = require("./routes/Rider_Distance");
var User_Demand = require("./routes/User_Demand");
var Payment = require("./routes/Create_Payment");
const {connectToDatabase,connectToTestDB} = require("./config/Connection");

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const port = process.env.PORT;


connectToTestDB();

//UNCOMMENT THIS FOR PROD
 //connectToDatabase(username, password);

app.use(bodyParser.json());
app.use("/api",getAllAddresses,userLocation,riderDistance,User_Demand,Payment);


app.listen(port, () => {
    console.log(`Server is running`);
});

