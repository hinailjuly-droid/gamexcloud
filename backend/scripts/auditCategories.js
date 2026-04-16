const mongoose = require('mongoose');

async function audit() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/pixelvault');
    const db = mongoose.connection.db;
    const cats = await db.collection('games').aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    
    console.log(JSON.stringify(cats, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

audit();
