const mongoose = require('mongoose');

// PASTE YOUR CONNECTION STRING HERE TO TEST
const uri = "mongodb+srv://hinailjuly_db_user:Rohitda%4012345@h5games.s0ynyd1.mongodb.net/h5games";

async function test() {
    console.log("📡 Attempting to connect to Atlas...");
    try {
        await mongoose.connect(uri);
        console.log("✅ SUCCESS! Your connection string is correct.");
        process.exit(0);
    } catch (err) {
        console.error("❌ FAILED!");
        console.error(err.message);
        process.exit(1);
    }
}

test();
