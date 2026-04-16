const mongoose = require('mongoose');
require('dotenv').config();

const STANDALONE_DOMAINS = [
  'itch.io', 'royalur.net', 'boris.re', 'victorzhou.com', 'repulzor.itch.io', 
  'kenamick.itch.io', 'vmikhav.itch.io'
];

async function updateStandalone() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pixelvault');
    console.log('✅ Connected to MongoDB');

    const games = await mongoose.connection.db.collection('games').find({ active: true }).toArray();
    
    let updatedCount = 0;
    for (const game of games) {
      const isStandalone = STANDALONE_DOMAINS.some(domain => game.playUrl.toLowerCase().includes(domain));

      if (isStandalone && !game.standalone) {
        await mongoose.connection.db.collection('games').updateOne(
          { _id: game._id },
          { $set: { standalone: true } }
        );
        updatedCount++;
        console.log(`🚀 Marked as Standalone: ${game.title} (URL: ${game.playUrl})`);
      }
    }

    console.log(`\n✅ Update complete. Marked ${updatedCount} games as standalone.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during update:', error);
    process.exit(1);
  }
}

updateStandalone();
