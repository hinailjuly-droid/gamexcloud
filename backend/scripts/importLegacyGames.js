require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('../src/models/Game');

async function importLegacy() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📡 Connected to MongoDB');

    // 1. Wipe old GitHub junk
    await Game.deleteMany({});
    console.log('🧹 Wiped existing games collection');

    // 2. Load backup
    const fs = require('fs');
    const path = require('path');
    const backupPath = path.join(__dirname, '../games-backup.json');
    const games = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    // 3. Filter for curated games (either verified or from htmlgames.com)
    // We also want to exclude the ones that clearly look like raw github repos (e.g. name with slash)
    const curatedGames = games.filter(g => 
      g.verified === true || 
      (g.playUrl && g.playUrl.includes('htmlgames.com')) ||
      (g.thumbnail && g.thumbnail.includes('htmlgames.com'))
    );

    console.log(`🔍 Found ${curatedGames.length} curated games in backup`);

    // 4. Map to new structure if needed (ensure slug and title exist)
    const validGames = curatedGames.map(g => ({
      ...g,
      _id: undefined, // Let MongoDB generate new ID
      fetchedAt: undefined,
      githubId: undefined, // Remove github reference
    }));

    // 5. Insert
    if (validGames.length > 0) {
      await Game.insertMany(validGames);
      console.log(`✅ Successfully imported ${validGames.length} curated games!`);
    } else {
      console.log('⚠️ No curated games found to import');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Import failed:', err);
    process.exit(1);
  }
}

importLegacy();
