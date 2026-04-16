const mongoose = require('mongoose');
require('dotenv').config();
const { fetchHtmlGamesCatalog } = require('../src/services/htmlGamesFetch');
const Game = require('../src/models/Game');

const syncGames = async () => {
    try {
        console.log('🚀 Starting htmlgames.com migration...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Step 1: Deactivate existing games (Fresh Start)
        console.log('🧹 Deactivating legacy games...');
        await Game.updateMany({}, { active: false, featured: false });

        // Step 2: Fetch new games
        const games = await fetchHtmlGamesCatalog();
        
        if (games.length === 0) {
            console.error('❌ No games found in feed. Aborting.');
            process.exit(1);
        }

        console.log(`📦 Preparing to sync ${games.length} games...`);

        let createdCount = 0;
        let updatedCount = 0;

        for (const gameData of games) {
            const result = await Game.findOneAndUpdate(
                { slug: gameData.slug },
                { 
                    ...gameData, 
                    verified: true,
                    active: true 
                },
                { upsert: true, new: true }
            );

            if (result.createdAt === result.updatedAt) {
                createdCount++;
            } else {
                updatedCount++;
            }
        }

        console.log(`✨ Migration Complete! Created: ${createdCount}, Updated: ${updatedCount}`);

        // Step 3: Pick some new Featured Gems
        console.log('⭐ Selecting new featured gems...');
        await Game.updateMany({}, { featured: false });
        const randomGames = await Game.aggregate([
            { $match: { active: true } },
            { $sample: { size: 12 } }
        ]);
        const ids = randomGames.map(g => g._id);
        await Game.updateMany(
            { _id: { $in: ids } },
            { $set: { featured: true } }
        );

        console.log('🏁 All done! Your PixelVault is now powered by htmlgames.com');
        process.exit(0);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

syncGames();
