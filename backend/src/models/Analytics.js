const mongoose = require('mongoose');
const crypto = require('crypto');

const analyticsSchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
    index: true
  },
  event: {
    type: String,
    enum: ['view', 'play', 'share'],
    required: true,
    index: true
  },
  ip: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for analytics queries
analyticsSchema.index({ event: 1, timestamp: -1 });
analyticsSchema.index({ gameId: 1, event: 1 });

// Static method to hash IP
analyticsSchema.statics.hashIP = function(ip) {
  return crypto.createHash('sha256').update(ip + 'pixelvault-salt').digest('hex').substring(0, 16);
};

module.exports = mongoose.model('Analytics', analyticsSchema);
