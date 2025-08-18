'use strict';

const express = require('express');
const {
  register,
  signIn,
  verifyOTP,
  getMe,
  logout,
  protect
} = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user and generate OTP
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/signin
// @desc    Login user and return JWT
// @access  Public
router.post('/signin', signIn);

// @route   POST /api/auth/activate
// @desc    Verify OTP and activate account
// @access  Public
router.post('/activate', verifyOTP);

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
router.get('/me', protect, getMe);

// @route   POST /api/auth/logout
// @desc    Log out user (client handles token removal)
// @access  Public
router.post('/logout', logout);

module.exports = router;
