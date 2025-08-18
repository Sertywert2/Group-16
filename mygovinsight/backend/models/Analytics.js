'use strict';

const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  users: { type: Number, default: 0 },
  sessions: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analytics', analyticsSchema);
