const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const PROD_URI = process.env.MONGODB_URI;

async function importProd() {
    console.log("🚀 Starting Production Restore from Backup JSON...");
    
    if (!PROD_URI) {
        console.error("❌ MONGODB_URI is missing from environment!");
        process.exit(1);
    }

    let conn;
    try {
        const backupPath = path.join(__dirname, '../games-backup.json');
        if (!fs.existsSync(backupPath)) {
            console.error("❌ games-backup.json not found!");
            process.exit(1);
        }

        const games = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        console.log(`📦 Loaded ${games.length} games from backup.`);

        conn = await mongoose.createConnection(PROD_URI).asPromise();
        console.log("✅ Production Atlas Connected");

        const GameModel = conn.model('Game', new mongoose.Schema({}, { strict: false }));

        console.log("🧹 Wiping current production data...");
        await GameModel.deleteMany({});
        console.log("✅ Data cleared.");

        console.log("📤 Restoring original curated games...");
        const batchSize = 100;
        for (let i = 0; i < games.length; i += batchSize) {
            const batch = games.slice(i, i + batchSize);
            await GameModel.insertMany(batch);
            console.log(`🚀 Restored ${i + batch.length}/${games.length}...`);
        }

        console.log("🏁 RESTORATION COMPLETE!");
    } catch (err) {
        console.error("❌ Restore failed:", err);
    } finally {
        if (conn) await conn.close();
        process.exit(0);
    }
}

importProd();
