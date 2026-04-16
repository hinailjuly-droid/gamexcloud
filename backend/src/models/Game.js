const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  githubId: {
    type: Number,
    unique: true,
    sparse: true,
    index: true
  },
  name: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  customDescription: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: [
      'Action & Arcade', 
      'Action', 
      'Arcade',
      'Board Games', 
      'Board & Card',
      'Card & Solitaire', 
      'Hidden Object', 
      'Mahjong', 
      'Match 3', 
      'Multiplayer', 
      'Puzzle', 
      'Racing', 
      'RPG',
      'Simulation',
      'Platformer',
      'Sports', 
      'Strategy & Simulation', 
      'Strategy',
      'Word Games', 
      'Other'
    ],
    default: 'Other',
    index: true
  },
  tags: [{
    type: String
  }],
  license: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  },
  playUrl: {
    type: String,
    default: ''
  },
  hasLiveUrl: {
    type: Boolean,
    default: false
  },
  standalone: {
    type: Boolean,
    default: false
  },
  stars: {
    type: Number,
    default: 0,
    index: true
  },
  forks: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true,
    index: true
  },
  views: {
    type: Number,
    default: 0
  },
  plays: {
    type: Number,
    default: 0,
    index: true
  },
  lastUpdated: {
    type: Date
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Text index for search
gameSchema.index(
  { name: 'text', title: 'text', description: 'text', tags: 'text' },
  { language_override: 'none' }
);

// Compound indexes for common queries
gameSchema.index({ active: 1, category: 1 });
gameSchema.index({ active: 1, featured: 1 });
gameSchema.index({ active: 1, stars: -1 });
gameSchema.index({ active: 1, plays: -1 });
gameSchema.index({ active: 1, createdAt: -1 });

module.exports = mongoose.model('Game', gameSchema);
