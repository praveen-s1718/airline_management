require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const AirlineRoute = require('./airline.route.js');
const app = express();

//middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

//routes
app.use("/api", AirlineRoute);

// Start server first so Render doesn't time out
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Then connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to database!");
})
.catch((err) => {
    console.log("Connection failed!", err.message);
});












