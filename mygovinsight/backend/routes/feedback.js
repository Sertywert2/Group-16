'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const Feedback = require('../models/Feedback');
const { protect } = require('../controllers/authController');

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

// @route   POST /api/feedback
// @desc    Submit feedback with file uploads
// @access  Private
router.post('/', protect, upload.array('feedbackFiles'), async (req, res) => {
  try {
    const files = (req.files || []).map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
    }));

    const feedback = new Feedback({
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment || '',
      files,
    });

    await feedback.save();
    res.status(201).json({ success: true, message: 'Feedback submitted', feedback });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ success: false, message: 'Server error processing feedback' });
  }
});

// @route   GET /api/feedback
// @desc    Get feedback with pagination
// @access  Public (for now, but should be admin only in a real app)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const feedback = await Feedback.find()
      .populate('user', 'name email')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Feedback.countDocuments();

    res.json({
      feedback,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    console.error('Feedback fetch error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching feedback' });
  }
});

module.exports = router;