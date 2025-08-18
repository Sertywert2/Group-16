'use strict';

const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  path: String,
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  files: [fileSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', serviceSchema);