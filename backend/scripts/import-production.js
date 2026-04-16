const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const PROD_URI = process.env.MONGODB_URI;

async function importFull() {
    console.log("🚀 Starting FULL PRODUCTION RESTORE (Games + Blogs + Stats)...");
    
    if (!PROD_URI) {
        console.error("❌ MONGODB_URI is missing from environment!");
        process.exit(1);
    }

    let conn;
    try {
        const backupPath = path.join(__dirname, '../full-site-backup.json');
        if (!fs.existsSync(backupPath)) {
            console.error("❌ full-site-backup.json not found!");
            process.exit(1);
        }

        const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        console.log(`📦 Loaded backup: ${data.games.length} games, ${data.blogposts.length} blogs, ${data.analytics.length} stats.`);

        conn = await mongoose.createConnection(PROD_URI).asPromise();
        console.log("✅ Production Atlas Connected");

        const wipeAndRestore = async (collectionName, items) => {
            console.log(`🧹 Wiping production [${collectionName}]...`);
            await conn.db.collection(collectionName).deleteMany({});
            
            if (items.length > 0) {
                console.log(`📤 Restoring ${items.length} items to [${collectionName}]...`);
                // Use insertMany in batches
                const batchSize = 100;
                for (let i = 0; i < items.length; i += batchSize) {
                    const batch = items.slice(i, i + batchSize);
                    await conn.db.collection(collectionName).insertMany(batch);
                }
                console.log(`✅ [${collectionName}] restored.`);
            }
        };

        await wipeAndRestore('games', data.games);
        await wipeAndRestore('blogposts', data.blogposts);
        await wipeAndRestore('analytics', data.analytics);

        console.log("🏁 FULL RESTORATION COMPLETE! Refresh your site now.");
    } catch (err) {
        console.error("❌ Restore failed:", err);
    } finally {
        if (conn) await conn.close();
        process.exit(0);
    }
}

importFull();
