require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

const app = express();
const port = 3000;
const mongoose = require('mongoose');
var getAllAddresses = require("./routes/Get_All_Address");
var userLocation = require("./routes/User_Location");
var riderDistance = require("./routes/Rider_Distance");

 mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.zeh2plr.mongodb.net/`);
 mongoose.connection.on('connected', (err) => {
  if (err) {
      console.log(err);
  } else {
      console.log("Connected to server");
  }
});

app.use(bodyParser.json());
app.use("/api",getAllAddresses,userLocation,riderDistance);


app.listen(port, () => {
    console.log(`Server is running`);
});

