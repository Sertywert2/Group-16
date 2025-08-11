// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET /auth/login => Show login form
router.get('/login', authController.showLoginForm);

// POST /auth/login => Handle login submission
router.post('/login', authController.handleLogin);

// POST /auth/logout => Handle logout
router.post('/logout', authController.handleLogout);

// (Optional) GET /auth/logout
router.get('/logout', authController.handleLogout);

module.exports = router;