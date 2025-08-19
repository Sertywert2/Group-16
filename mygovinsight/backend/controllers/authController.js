'use strict';

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET, // ✅ use JWT_SECRET from .env
    { expiresIn: '24h' }
  );
};

exports.register = async (req, res) => {
  try {
    // Public registration: citizens only. Do not accept isAdmin from client.
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      name,
      email,
      password,
      isAdmin: false,
      otp,
      isVerified: false,
    });

    await user.save();

    console.log(`Registration OTP for ${email}: ${otp}`);
    res.status(201).json({
      message: 'Registration successful, check email for OTP',
      otp,
      email,
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const validPassword = user && (await bcrypt.compare(password, user.password));
    if (!user || !validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Allow unverified login only if explicitly enabled (development convenience)
    const allowUnverified = process.env.ALLOW_UNVERIFIED_LOGIN === 'true';
    if (!user.isVerified && !allowUnverified) {
      return res.status(403).json({ message: 'Account not verified. Please verify OTP.' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.isVerified)
      return res.status(400).json({ message: 'User already verified' });

    if (user.otp !== otp) {
      console.log(
        `OTP verification failed for ${email}: Expected ${user.otp}, Received ${otp}`
      );
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    const token = generateToken(user);

    res.json({
      message: 'Account activated',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Activation error', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: 'User fetch error', error: err.message });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Logged out' });
};

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ use JWT_SECRET
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(404).json({ message: 'User not found' });

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token failed', error: err.message });
  }
};
