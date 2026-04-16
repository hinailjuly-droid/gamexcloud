const mongoose = require('mongoose');
require('dotenv').config();

const NON_GAME_KEYWORDS = [
  'template', 'boilerplate', 'starter', 'engine', 'plugin', 'api', 'server', 
  'client', 'tutorial', 'course', 'library', 'lib', 'wrapper', 'effect', 
  'theme', 'framework', 'vfx', 'shader', 'asset', 'resource'
];

async function research() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pixelvault');
    console.log('✅ Connected to MongoDB');

    const games = await mongoose.connection.db.collection('games').find({ active: true }).toArray();
    console.log(`📊 Total active games in DB: ${games.length}`);

    const flagged = games.filter(game => {
      const searchText = `${game.title} ${game.description} ${game.tags.join(' ')}`.toLowerCase();
      return NON_GAME_KEYWORDS.some(keyword => searchText.includes(keyword));
    });

    console.log(`❌ Potential non-games flagged: ${flagged.length}`);
    console.log('\n--- FIRST 20 FLAGGED ITEMS ---');
    flagged.slice(0, 20).forEach(g => {
      console.log(`- [${g.category}] ${g.title}`);
      console.log(`  Desc: ${g.description.substring(0, 60)}...`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

research();
