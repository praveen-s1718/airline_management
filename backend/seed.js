require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Admin, Airport, Airline } = require('./airline.model.js');

const airports = [
    { name: "Indira Gandhi International Airport", code: "DEL", city: "Delhi", country: "India" },
    { name: "Chhatrapati Shivaji Maharaj International Airport", code: "BOM", city: "Mumbai", country: "India" },
    { name: "Kempegowda International Airport", code: "BLR", city: "Bangalore", country: "India" },
    { name: "Rajiv Gandhi International Airport", code: "HYD", city: "Hyderabad", country: "India" },
    { name: "Chennai International Airport", code: "MAA", city: "Chennai", country: "India" },
    { name: "Netaji Subhas Chandra Bose International Airport", code: "CCU", city: "Kolkata", country: "India" },
    { name: "Sardar Vallabhbhai Patel International Airport", code: "AMD", city: "Ahmedabad", country: "India" },
    { name: "Pune Airport", code: "PNQ", city: "Pune", country: "India" },
    { name: "Cochin International Airport", code: "COK", city: "Kochi", country: "India" },
    { name: "Lokpriya Gopinath Bordoloi International Airport", code: "GAU", city: "Guwahati", country: "India" },
    { name: "Jay Prakash Narayan Airport", code: "PAT", city: "Patna", country: "India" },
    { name: "Jaipur International Airport", code: "JAI", city: "Jaipur", country: "India" },
    { name: "Lucknow Airport", code: "LKO", city: "Lucknow", country: "India" },
    { name: "Srinagar Airport", code: "SXR", city: "Srinagar", country: "India" },
    { name: "Amritsar Airport", code: "ATQ", city: "Amritsar", country: "India" },
    { name: "Nagpur Airport", code: "NAG", city: "Nagpur", country: "India" },
    { name: "Coimbatore International Airport", code: "CJB", city: "Coimbatore", country: "India" },
    { name: "Jodhpur Airport", code: "JDH", city: "Jodhpur", country: "India" },
    { name: "Goa International Airport", code: "GOI", city: "Goa", country: "India" },
    { name: "Bagdogra Airport", code: "IXB", city: "Siliguri", country: "India" },
];

const airlines = [
    { code: "AI" },   // Air India
    { code: "6E" },   // IndiGo
    { code: "SG" },   // SpiceJet
    { code: "UK" },   // Vistara
    { code: "G8" },   // Go Air
];

const adminUsername = "admin";
const adminPassword = "admin123";

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB!");

        // Clear existing data
        await Airport.deleteMany({});
        await Airline.deleteMany({});
        await Admin.deleteMany({});
        console.log("🗑️  Cleared existing data");

        // Seed Airports
        await Airport.insertMany(airports);
        console.log(`✅ Inserted ${airports.length} airports`);

        // Seed Airlines
        await Airline.insertMany(airlines);
        console.log(`✅ Inserted ${airlines.length} airlines`);

        // Seed Admin
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        await Admin.create({ username: adminUsername, hashedPassword });
        console.log(`✅ Admin created — username: "${adminUsername}", password: "${adminPassword}"`);

        console.log("\n🎉 Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error.message);
        process.exit(1);
    }
};

seedDB();
