const mongoose = require('mongoose');

// --- CONFIGURATION ---
const LOCAL_URI = 'mongodb://127.0.0.1:27017/pixelvault';
const PROD_URI = 'mongodb+srv://hinailjuly_db_user:H5Games2026@h5games.s0ynyd1.mongodb.net/h5games';

async function migrate() {
    console.log("🚀 Starting Data Rescue: Local -> Production");

    let localConn, prodConn;

    try {
        console.log("📡 Connecting to Local Database...");
        localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
        console.log("✅ Local Connected");

        console.log("📡 Connecting to Production Atlas...");
        prodConn = await mongoose.createConnection(PROD_URI).asPromise();
        console.log("✅ Production Connected");

        const GameModel = localConn.model('Game', new mongoose.Schema({}, { strict: false }));
        const ProdGameModel = prodConn.model('Game', new mongoose.Schema({}, { strict: false }));

        const localGames = await GameModel.find({}).lean();
        console.log(`📦 Found ${localGames.length} games to migrate.`);

        if (localGames.length === 0) {
            console.log("⚠️ No games found locally. Aborting.");
            return;
        }

        console.log("🧹 Wiping incorrect production data...");
        await ProdGameModel.deleteMany({});
        console.log("✅ Production data cleared.");

        console.log("📤 Uploading local games to production...");
        
        // Batch upload for performance (100 at a time)
        const batchSize = 100;
        for (let i = 0; i < localGames.length; i += batchSize) {
            const batch = localGames.slice(i, i + batchSize);
            // Remove the local _id to let Atlas generate new ones (or keep if dependencies exist)
            // Assuming no cross-references for now
            const cleanBatch = batch.map(g => {
                const { _id, ...rest } = g;
                return rest;
            });
            await ProdGameModel.insertMany(cleanBatch);
            console.log(`🚀 Uploaded ${i + cleanBatch.length}/${localGames.length}...`);
        }

        console.log("🎉 MIGRATION COMPLETE! Your live site now matches your local site.");

    } catch (error) {
        console.error("❌ Migration failed!");
        console.error(error);
    } finally {
        if (localConn) await localConn.close();
        if (prodConn) await prodConn.close();
        process.exit(0);
    }
}

migrate();
