const mongoose = require('mongoose');
require('dotenv').config();

const NON_GAME_KEYWORDS = [
  'template', 'boilerplate', 'starter', 'engine', 'plugin', 'api', 'server', 
  'client', 'tutorial', 'course', 'library', 'lib', 'wrapper', 'effect', 
  'theme', 'framework', 'vfx', 'shader', 'asset', 'resource'
];

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pixelvault');
    console.log('✅ Connected to MongoDB');

    const games = await mongoose.connection.db.collection('games').find({ active: true }).toArray();
    
    let deactivatedCount = 0;
    for (const game of games) {
      const searchText = `${game.title} ${game.description} ${game.tags.join(' ')}`.toLowerCase();
      const isNonGame = NON_GAME_KEYWORDS.some(keyword => searchText.includes(keyword)) ||
                        game.title.toLowerCase().includes('template') ||
                        game.title.toLowerCase().includes('boilerplate');

      if (isNonGame) {
        await mongoose.connection.db.collection('games').updateOne(
          { _id: game._id },
          { $set: { active: false, status: 'deactivated_as_non_game' } }
        );
        deactivatedCount++;
        console.log(`🚫 Deactivated: ${game.title}`);
      }
    }

    console.log(`\n✅ Cleanup complete. Deactivated ${deactivatedCount} non-game repositories.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanup();
