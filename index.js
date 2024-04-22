const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
var getAllAddresses = require("./routes/Get_All_Address");
var homeLocation = require("./routes/Home_Location");
var workLocation = require("./routes/Work_Location");
var riderDistance = require("./routes/RiderDistance");

 mongoose.connect("mongodb://localhost:27017/locations");
 mongoose.connection.on('connected', (err) => {
  if (err) {
      console.log(err);
  } else {
      console.log("Connected to server");
  }
});

app.use(bodyParser.json());
app.use("/api",getAllAddresses,homeLocation,workLocation,riderDistance);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

