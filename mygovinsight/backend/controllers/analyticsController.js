'use strict';

const Analytics = require('../models/Analytics');

exports.getAnalytics = async (req, res) => {
  try {
    let data = await Analytics.findOne({ user: req.user._id });

    if (!data) {
      data = new Analytics({
        user: req.user._id,
        users: 0,
        sessions: 0,
        revenue: 0,
      });
    }

    res.json(data);
  } catch (err) {
    console.error('Analytics fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
  }
};
