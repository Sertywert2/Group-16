'use strict';

const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { protect } = require('../controllers/authController');

// @route   GET /api/dashboard
// @desc    Combined data for admin dashboard
// @access  Private (admin suggested, but allow any authenticated for now)
router.get('/', protect, getDashboard);

module.exports = router;
