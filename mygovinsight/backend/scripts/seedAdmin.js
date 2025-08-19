'use strict';

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

(async () => {
  const mongoUri = process.env.MONGO_URI;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Administrator';

  if (!mongoUri) {
    console.error('Missing MONGO_URI in backend/.env');
    process.exit(1);
  }
  if (!email || !password) {
    console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in backend/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    let user = await User.findOne({ email });
    if (user) {
      if (!user.isAdmin) {
        user.isAdmin = true;
        user.isVerified = true;
        if (password) user.password = password; // will be hashed by pre-save
        await user.save();
        console.log('Existing user promoted to admin:', email);
      } else {
        console.log('Admin already exists:', email);
      }
    } else {
      user = new User({ name, email, password, isAdmin: true, isVerified: true });
      await user.save();
      console.log('Admin user created:', email);
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
