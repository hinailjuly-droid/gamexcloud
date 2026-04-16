const mongoose = require('mongoose');

const MAPPING = {
  // Puzzle
  '1010 Block': 'Puzzle',
  '2048 & Merge': 'Puzzle',
  'Brain Games': 'Puzzle',
  'Daily Puzzles': 'Puzzle',
  'Difference Games': 'Puzzle',
  'Math Games': 'Puzzle',
  'Maze Games': 'Puzzle',
  'Memory': 'Puzzle',
  'Puzzle': 'Puzzle',
  'Puzzle Games': 'Puzzle',
  'Puzzles': 'Puzzle',
  'Sorting Games': 'Puzzle',
  'Sudoku': 'Puzzle',
  'Tile Games': 'Puzzle',
  
  // Mahjong
  '3D Mahjong': 'Mahjong',
  'Mahjong Connect': 'Mahjong',
  'Mahjong Games': 'Mahjong',
  'Mahjong Slide': 'Mahjong',
  'Mahjong Solitaire': 'Mahjong',
  'Mahjong Tower': 'Mahjong',
  
  // Hidden Object
  'Hidden Alphabet': 'Hidden Object',
  'Hidden Clues': 'Hidden Object',
  'Hidden Numbers': 'Hidden Object',
  'Hidden Object Games': 'Hidden Object',
  'Escape Games': 'Hidden Object',
  
  // Card & Solitaire
  'Board & Card': 'Card & Solitaire',
  'Card Games': 'Card & Solitaire',
  'Freecell': 'Card & Solitaire',
  'Klondike': 'Card & Solitaire',
  'Montana': 'Card & Solitaire',
  'Pyramid': 'Card & Solitaire',
  'Solitaire Games': 'Card & Solitaire',
  'Spider': 'Card & Solitaire',
  'Tripeaks & Golf': 'Card & Solitaire',
  
  // Match 3
  'Bejeweled': 'Match 3',
  'Bubble Shooter': 'Match 3',
  'Collapse Games': 'Match 3',
  'Connect 3': 'Match 3',
  'Match 3 Games': 'Match 3',
  'Zuma Games': 'Match 3',
  
  // Action & Arcade
  'Action': 'Action & Arcade',
  'Arcade': 'Action & Arcade',
  'Arkanoid': 'Action & Arcade',
  'Pac Maze': 'Action & Arcade',
  'Pinball': 'Action & Arcade',
  'Platform': 'Action & Arcade',
  'Platformer': 'Action & Arcade',
  'Skill': 'Action & Arcade',
  'Retro': 'Action & Arcade',
  'Tetris': 'Action & Arcade',
  'Snake': 'Action & Arcade',
  'RPG': 'Action & Arcade',
  
  // Sports
  'Billiards': 'Sports',
  'Golf': 'Sports',
  'Sports': 'Sports',
  
  // Racing
  'Racing': 'Racing',
  
  // Strategy & Simulation
  'Simulation': 'Strategy & Simulation',
  'Strategy': 'Strategy & Simulation',
  'Tower Defense': 'Strategy & Simulation',
  'Time management': 'Strategy & Simulation',
  'Shooting & War': 'Strategy & Simulation',
  
  // Word Games
  'Word Games': 'Word Games',
  'Crosswords': 'Word Games',
  
  // Board Games
  'Board': 'Board Games',
  
  // Multiplayer
  'Multiplayer': 'Multiplayer'
};

async function migrate() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/pixelvault');
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const gamesCollection = db.collection('games');
    
    let updatedCount = 0;
    
    for (const [oldCat, newCat] of Object.entries(MAPPING)) {
      const result = await gamesCollection.updateMany(
        { category: oldCat },
        { $set: { category: newCat } }
      );
      updatedCount += result.modifiedCount;
      console.log(`Mapped "${oldCat}" to "${newCat}": ${result.modifiedCount} games updated`);
    }
    
    // Handle titles with keywords for those remaining in "Other" or unknown
    const otherGames = await gamesCollection.find({ category: 'Other' }).toArray();
    console.log(`Analyzing ${otherGames.length} games in "Other"...`);
    
    for (const game of otherGames) {
      const title = game.title.toLowerCase();
      let newCat = 'Puzzle'; // Default fallback
      
      if (title.includes('mahjong')) newCat = 'Mahjong';
      else if (title.includes('card') || title.includes('poker') || title.includes('solitaire')) newCat = 'Card & Solitaire';
      else if (title.includes('bubble') || title.includes('match') || title.includes('jewel')) newCat = 'Match 3';
      else if (title.includes('racing') || title.includes('drive') || title.includes('car')) newCat = 'Racing';
      else if (title.includes('sport') || title.includes('golf') || title.includes('pool')) newCat = 'Sports';
      else if (title.includes('hidden') || title.includes('escape')) newCat = 'Hidden Object';
      else if (title.includes('word') || title.includes('crossword')) newCat = 'Word Games';
      else if (title.includes('action') || title.includes('arcade')) newCat = 'Action & Arcade';
      
      await gamesCollection.updateOne({ _id: game._id }, { $set: { category: newCat } });
      updatedCount++;
    }

    console.log(`Migration complete! Total games updated: ${updatedCount}`);
    
    // Verify results
    const finalCats = await gamesCollection.distinct('category');
    console.log('Final Categories:', finalCats);
    
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
