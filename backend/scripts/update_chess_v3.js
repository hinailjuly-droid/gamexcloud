const mongoose = require('mongoose');
const Game = require('../src/models/Game');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pixelvault';

async function updateThumbnails() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const result = await Game.updateMany(
      { title: /chess/i },
      { $set: { thumbnail: '/assets/games/chess_v3.jpg' } }
    );

    console.log(`Successfully updated ${result.modifiedCount} games.`);
    process.exit(0);
  } catch (err) {
    console.error('Update failed:', err);
    process.exit(1);
  }
}

updateThumbnails();
