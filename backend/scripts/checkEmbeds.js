const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

async function checkEmbeddability() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pixelvault');
    console.log('✅ Connected to MongoDB');

    const games = await mongoose.connection.db.collection('games').find({ active: true }).toArray();
    console.log(`📊 Checking ${games.length} games...`);

    const headers_to_check = ['x-frame-options', 'content-security-policy'];
    let blockedCount = 0;

    for (const game of games) {
      try {
        const response = await axios.get(game.playUrl, { 
          timeout: 5000, 
          headers: { 'User-Agent': 'Mozilla/5.0' },
          validateStatus: false 
        });
        
        const xfo = response.headers['x-frame-options']?.toLowerCase();
        const csp = response.headers['content-security-policy']?.toLowerCase();
        
        if (xfo === 'deny' || xfo === 'sameorigin' || (csp && csp.includes('frame-ancestors'))) {
          console.log(`❌ BLOCKED: [${game.title}] - ${game.playUrl} (XFO: ${xfo || 'N/A'})`);
          blockedCount++;
        }
      } catch (err) {
        // console.log(`⚠️  TIMEOUT/ERROR: [${g.title}]`);
      }
    }

    console.log(`\n🏁 Scan complete. ${blockedCount} games are likely non-embeddable.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkEmbeddability();
