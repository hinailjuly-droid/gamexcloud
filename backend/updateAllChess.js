const mongoose = require('mongoose');
const Game = require('./src/models/Game');
require('dotenv').config();

async function updateAllChessThumbnails() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update any game that has "chess" in the title (case insensitive)
    const result = await Game.updateMany(
      { title: /chess/i },
      { thumbnail: '/assets/games/chess.jpg' }
    );

    console.log(`Updated ${result.modifiedCount} Chess games`);

    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updateAllChessThumbnails();
