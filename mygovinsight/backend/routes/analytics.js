'use strict';

const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../controllers/authController');

// @route   GET /api/analytics
// @desc    Get analytics data for the current user (if admin, all data)
// @access  Private
router.get('/', protect, getAnalytics);

module.exports = router;