'use strict';

const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  path: String,
});

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  files: [fileSchema],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', feedbackSchema);
