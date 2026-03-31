require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const AirlineRoute = require('./airline.route.js');
const { Flight, Airport, Airline } = require('./airline.model.js');
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

// Auto-seed flights (optimized for MongoDB free tier — 512 MB limit)
// - Deletes expired flights to free storage
// - Only seeds 3 days ahead with 3 airports (~36 flights max)
const autoSeedFlights = async () => {
    try {
        // Step 1: Clean up expired flights (departed more than 2 days ago)
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const deleted = await Flight.deleteMany({
            'departure.scheduledTime': { $lt: twoDaysAgo },
            'bookings': { $size: 0 } // Only delete flights with no bookings
        });
        if (deleted.deletedCount > 0) {
            console.log(`🗑️ Cleaned up ${deleted.deletedCount} expired flights`);
        }

        // Step 2: Seed flights for the next 3 days (only missing days)
        const airports = await Airport.find().limit(3); // 3 airports = 6 routes
        const airlines = await Airline.find().limit(2);

        if (airports.length < 2 || airlines.length === 0) {
            console.log("⚠️ Auto-seed skipped: not enough airports/airlines in DB.");
            return;
        }

        let flightsToInsert = [];
        let flightNumberCounter = Date.now() % 100000;

        for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const flightDate = new Date(today);
            flightDate.setDate(today.getDate() + dayOffset);

            const nextDay = new Date(flightDate);
            nextDay.setDate(flightDate.getDate() + 1);

            // Skip days that already have flights
            const existingCount = await Flight.countDocuments({
                'departure.scheduledTime': { $gte: flightDate, $lt: nextDay }
            });
            if (existingCount > 0) continue;

            for (let i = 0; i < airports.length; i++) {
                for (let j = 0; j < airports.length; j++) {
                    if (i === j) continue;

                    const depAirport = airports[i];
                    const arrAirport = airports[j];
                    const airline = airlines[i % airlines.length];

                    // Morning flight
                    let depTime = new Date(flightDate);
                    depTime.setHours(8, 0, 0, 0);
                    let arrTime = new Date(flightDate);
                    arrTime.setHours(11, 30, 0, 0);

                    // Evening flight
                    let depTime2 = new Date(flightDate);
                    depTime2.setHours(18, 0, 0, 0);
                    let arrTime2 = new Date(flightDate);
                    arrTime2.setHours(21, 30, 0, 0);

                    const baseFlight = {
                        duration: 3.5,
                        bookings: [],
                        status: 'scheduled',
                        reviewNotification: false,
                        notificationsSent: { '24h': false, '12h': false, '2h': false },
                        seatAvailability: { economy: ['1A', '1B', '1C', '2A', '2B', '2C'] }
                    };

                    flightsToInsert.push({
                        ...baseFlight,
                        flightNumber: `${airline.code}-${flightNumberCounter++}`,
                        departure: { airportCity: depAirport.city, scheduledTime: depTime, actualTime: depTime },
                        arrival: { airportCity: arrAirport.city, scheduledTime: arrTime, actualTime: arrTime },
                        capacity: { economySeats: 120 },
                        price: { economy: 5000 + Math.floor(Math.random() * 2000) }
                    });

                    flightsToInsert.push({
                        ...baseFlight,
                        flightNumber: `${airline.code}-${flightNumberCounter++}`,
                        departure: { airportCity: depAirport.city, scheduledTime: depTime2, actualTime: depTime2 },
                        arrival: { airportCity: arrAirport.city, scheduledTime: arrTime2, actualTime: arrTime2 },
                        capacity: { economySeats: 150 },
                        price: { economy: 4200 + Math.floor(Math.random() * 2000) }
                    });
                }
            }
        }

        if (flightsToInsert.length > 0) {
            await Flight.insertMany(flightsToInsert);
            console.log(`✅ Auto-seeded ${flightsToInsert.length} flights for upcoming days`);
        } else {
            console.log("✅ All upcoming days already have flights, no seeding needed");
        }
    } catch (error) {
        console.error("❌ Auto-seed error:", error.message);
    }
};

// Start server first so Render doesn't time out
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Then connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log("Connected to database!");
    
    // Seed flights on startup
    await autoSeedFlights();
    
    // Schedule daily auto-seed at midnight
    cron.schedule('0 0 * * *', () => {
        console.log('🕛 Running daily flight auto-seed...');
        autoSeedFlights();
    });
})
.catch((err) => {
    console.log("Connection failed!", err.message);
});












