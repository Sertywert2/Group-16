'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  otp: String,
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // Use lower salt rounds for speed
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
