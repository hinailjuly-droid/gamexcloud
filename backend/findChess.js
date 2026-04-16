const mongoose = require('mongoose');
const Game = require('./src/models/Game');
require('dotenv').config();

async function findChessSlugs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const games = await Game.find({ title: /chess/i }).select('title slug thumbnail');
    console.log('Found games:', JSON.stringify(games, null, 2));
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

findChessSlugs();
