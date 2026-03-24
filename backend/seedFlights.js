require('dotenv').config();
const mongoose = require('mongoose');
const { Flight, Airport, Airline } = require('./airline.model.js');

const seedFlights = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB!");

        // 1. Get some airports
        const airports = await Airport.find().limit(5);
        if (airports.length < 2) {
            console.log("❌ Not enough airports in DB. Please run node seed.js first.");
            process.exit(1);
        }

        // 2. Get airlines
        const airlines = await Airline.find().limit(2);
        if (airlines.length === 0) {
            console.log("❌ Not enough airlines in DB.");
            process.exit(1);
        }

        // Clear existing flights first (optional, but good for testing)
        // Note: For a live project with active users we shouldn't do this, 
        // but since this is dev/test data it's fine.
        await Flight.deleteMany({});
        console.log("🗑️ Cleared existing flights");

        let flightsToInsert = [];
        let flightNumberCounter = 2000;

        // Generate flights for the next 7 days
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Start of today
            
            // Flight Date
            const flightDate = new Date(today);
            flightDate.setDate(today.getDate() + dayOffset);
            
            for (let i = 0; i < airports.length; i++) {
                for (let j = 0; j < airports.length; j++) {
                    if (i === j) continue;
                    
                    const depAirport = airports[i];
                    const arrAirport = airports[j];
                    const airline = airlines[i % airlines.length];
                    
                    // Create a morning flight
                    let depTime = new Date(flightDate);
                    depTime.setHours(8, 0, 0, 0); 
                    
                    let arrTime = new Date(flightDate);
                    arrTime.setHours(11, 30, 0, 0); 
                    
                    // Create an evening flight
                    let depTime2 = new Date(flightDate);
                    depTime2.setHours(18, 0, 0, 0); 

                    let arrTime2 = new Date(flightDate);
                    arrTime2.setHours(21, 30, 0, 0); 
                    
                    flightsToInsert.push({
                        flightNumber: `${airline.code}-${flightNumberCounter++}`,
                        departure: {
                            airportCity: depAirport.city,
                            scheduledTime: depTime,
                            actualTime: depTime
                        },
                        arrival: {
                            airportCity: arrAirport.city,
                            scheduledTime: arrTime,
                            actualTime: arrTime
                        },
                        duration: 3.5,
                        capacity: {
                            economySeats: 120
                        },
                        price: {
                            economy: 5000 + Math.floor(Math.random() * 2000)
                        },
                        seatAvailability: {
                            economy: ['1A', '1B', '1C', '2A', '2B', '2C']
                        },
                        bookings: [],
                        status: 'scheduled',
                        reviewNotification: false,
                        notificationsSent: {
                            '24h': false,
                            '12h': false,
                            '2h': false
                        }
                    });

                    flightsToInsert.push({
                        flightNumber: `${airline.code}-${flightNumberCounter++}`,
                        departure: {
                            airportCity: depAirport.city,
                            scheduledTime: depTime2,
                            actualTime: depTime2
                        },
                        arrival: {
                            airportCity: arrAirport.city,
                            scheduledTime: arrTime2,
                            actualTime: arrTime2
                        },
                        duration: 3.5,
                        capacity: {
                            economySeats: 150
                        },
                        price: {
                            economy: 4200 + Math.floor(Math.random() * 2000)
                        },
                        seatAvailability: {
                            economy: ['1A', '1B', '1C', '2A', '2B', '2C']
                        },
                        bookings: [],
                        status: 'scheduled',
                        reviewNotification: false,
                        notificationsSent: {
                            '24h': false,
                            '12h': false,
                            '2h': false
                        }
                    });
                }
            }
        }

        await Flight.insertMany(flightsToInsert);
        console.log(`✅ Inserted ${flightsToInsert.length} future flights!`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding flights:", error.message);
        process.exit(1);
    }
};

seedFlights();
