'use strict';

const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment, mainSector, subSector } = req.body;
    const files = req.files?.feedbackFiles?.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
    })) || [];
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    if (!mainSector || !subSector) {
      return res.status(400).json({ message: 'Main sector and sub sector are required' });
    }

    const feedback = new Feedback({
      user: req.user._id,
      rating,
      comment,
      files,
      mainSector,
      subSector,
      date: new Date(),
    });

    await feedback.save();
    console.log('Feedback request received:', feedback);
    res.status(201).json({ message: 'Feedback submitted', feedback });
  } catch (err) {
    res.status(500).json({ message: 'Feedback submission failed', error: err.message });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('user', 'name email')
      .populate('mainSector', 'name')
      .populate('subSector', 'name')
      .sort({ date: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch feedback', error: err.message });
  }
};