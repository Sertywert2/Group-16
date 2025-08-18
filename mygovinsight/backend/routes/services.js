'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const Service = require('../models/Service');
const { protect } = require('../controllers/authController');

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

// @route   POST /api/services
// @desc    Add a new service with file uploads
// @access  Private (Admin only)
router.post('/', protect, upload.array('serviceFiles', 5), async (req, res) => {
  try {
    // Only allow admins to add services
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const files = (req.files || []).map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
    }));

    const newService = new Service({
      name: req.body.name,
      description: req.body.description,
      files,
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    console.error('Service creation error:', err);
    res.status(500).json({ message: 'Failed to add service', error: err.message });
  }
});

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (err) {
    console.error('Service fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch services', error: err.message });
  }
});

module.exports = router;