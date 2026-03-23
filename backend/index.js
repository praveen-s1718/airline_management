require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const AirlineRoute = require('./airline.route.js');
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api",AirlineRoute);

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Connected to database!");
    // CHANGE THIS LINE: Use Render's PORT or default to 3000
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch(()=>{
    console.log("Connection failed!");
});












