const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/pixelvault').then(async () => {
    const db = mongoose.connection.db;
    const count = await db.collection('games').countDocuments({ githubId: { $exists: false } });
    console.log('Games without githubId:', count);
    const total = await db.collection('games').countDocuments();
    console.log('Total games:', total);
    
    // Check if there are any games with featured: true
    const featured = await db.collection('games').countDocuments({ featured: true });
    console.log('Featured games:', featured);

    process.exit(0);
});
