const mongoose = require('mongoose');
const fs = require('fs');

const LOCAL_URI = 'mongodb://127.0.0.1:27017/pixelvault';

async function exportLocal() {
    console.log("💾 Exporting local games to JSON...");
    let conn;
    try {
        conn = await mongoose.createConnection(LOCAL_URI).asPromise();
        const GameModel = conn.model('Game', new mongoose.Schema({}, { strict: false }));
        const games = await GameModel.find({}).lean();
        
        // Remove _id from games to prevent conflicts
        const cleanGames = games.map(g => {
            const { _id, ...rest } = g;
            return rest;
        });

        fs.writeFileSync('games-backup.json', JSON.stringify(cleanGames, null, 2));
        console.log(`✅ Successfully exported ${cleanGames.length} games to games-backup.json`);
    } catch (err) {
        console.error("❌ Export failed:", err);
    } finally {
        if (conn) await conn.close();
        process.exit(0);
    }
}

exportLocal();
