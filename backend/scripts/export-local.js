const mongoose = require('mongoose');
const fs = require('fs');

const LOCAL_URI = 'mongodb://127.0.0.1:27017/pixelvault';

async function exportFull() {
    console.log("💾 Exporting full database (Games + Blogs + Stats) to JSON...");
    let conn;
    try {
        conn = await mongoose.createConnection(LOCAL_URI).asPromise();
        const db = conn.db;

        const data = {
            games: await db.collection('games').find({}).toArray(),
            blogposts: await db.collection('blogposts').find({}).toArray(),
            analytics: await db.collection('analytics').find({}).toArray()
        };
        
        // Clean up _ids to prevent duplicate key errors on fresh import if needed, 
        // but keeping them usually preserves relations better if they aren't changing.
        // We'll keep them for consistency between Local/Prod.

        fs.writeFileSync('full-site-backup.json', JSON.stringify(data, null, 2));
        console.log(`✅ EXPORT SUCCESS!`);
        console.log(`   - Games: ${data.games.length}`);
        console.log(`   - Blogs: ${data.blogposts.length}`);
        console.log(`   - Stats: ${data.analytics.length}`);
    } catch (err) {
        console.error("❌ Export failed:", err);
    } finally {
        if (conn) await conn.close();
        process.exit(0);
    }
}

exportFull();
