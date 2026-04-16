const mongoose = require('mongoose');
const Game = require('./src/models/Game');
require('dotenv').config();

async function updateChessThumbnail() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the chess game by slug or title
    const result = await Game.findOneAndUpdate(
      { slug: 'chess' },
      { thumbnail: '/assets/games/chess.jpg' },
      { new: true }
    );

    if (result) {
      console.log('Successfully updated Chess thumbnail:', result.thumbnail);
    } else {
      console.log('Chess game not found');
    }

    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updateChessThumbnail();
