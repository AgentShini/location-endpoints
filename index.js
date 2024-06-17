require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

const app = express();
const port = 4000;
const mongoose = require('mongoose');
var getAllAddresses = require("./routes/Get_All_Address");
var userLocation = require("./routes/User_Location");
var riderDistance = require("./routes/Rider_Distance");
var User_Demand = require("./routes/User_Demand");
var Payment = require("./routes/Create_Payment");

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.ta9pvbh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
 //mongoose.connect('mongodb://localhost:27017/gofuel');
 mongoose.connection.on('connected', (err) => {
  if (err) {
      console.log(err);
  } else {
      console.log("Connected to server");
  }
});

app.use(bodyParser.json());
app.use("/api",getAllAddresses,userLocation,riderDistance,User_Demand,Payment);


app.listen(port, () => {
    console.log(`Server is running`);
});

