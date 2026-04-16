const mongoose = require('mongoose');
const Game = require('../src/models/Game');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pixelvault';

async function getStats() {
  try {
    await mongoose.connect(uri);
    const stats = await Game.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    console.log(JSON.stringify(stats, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

getStats();
