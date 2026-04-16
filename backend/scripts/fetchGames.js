#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('../src/models/Game');
const { fetchGamesFromGitHub } = require('../src/services/githubFetch');

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('❌ GITHUB_TOKEN not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pixelvault');
    console.log('✅ MongoDB connected');

    const games = await fetchGamesFromGitHub(token);
    
    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const gameData of games) {
      try {
        const existing = await Game.findOne({ githubId: gameData.githubId });
        
        if (existing) {
          // Update but preserve admin edits
          await Game.updateOne(
            { githubId: gameData.githubId },
            {
              $set: {
                stars: gameData.stars,
                forks: gameData.forks,
                lastUpdated: gameData.lastUpdated,
                tags: gameData.tags,
                language: gameData.language,
                fetchedAt: new Date(),
                // Only update these if they haven't been manually edited
                ...(existing.customDescription ? {} : { description: gameData.description }),
                ...(existing.thumbnail !== gameData.thumbnail && !existing.thumbnail.includes('cloudinary') ? { thumbnail: gameData.thumbnail } : {})
              }
            }
          );
          updated++;
        } else {
          await Game.create(gameData);
          created++;
        }
      } catch (err) {
        if (err.code === 11000) {
          // Duplicate slug - try with suffix
          try {
            gameData.slug = `${gameData.slug}-${gameData.githubId}`;
            await Game.create(gameData);
            created++;
          } catch (e) {
            errors++;
          }
        } else {
          console.error(`Error saving ${gameData.name}:`, err.message);
          errors++;
        }
      }
    }

    console.log(`\n📊 Fetch Results:`);
    console.log(`   ✅ Created: ${created}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📦 Total in DB: ${await Game.countDocuments()}`);

  } catch (error) {
    console.error('❌ Fetch failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Done');
    process.exit(0);
  }
}

main();
