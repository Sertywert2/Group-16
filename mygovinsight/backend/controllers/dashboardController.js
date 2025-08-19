'use strict';

const mongoose = require('mongoose');
const User = require('../models/User');
const Feedback = require('../models/Feedback');

// Helper: last N days buckets
function getLastNDates(n) {
  const dates = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  }
  return dates;
}

exports.getDashboard = async (req, res) => {
  try {
    // Metrics
    const [totalFeedback, avgRatingAgg] = await Promise.all([
      Feedback.countDocuments(),
      Feedback.aggregate([
        { $group: { _id: null, avg: { $avg: '$rating' } } },
      ]),
    ]);

    const averageRating = avgRatingAgg[0]?.avg || 0;

    // Weekly feedback counts (last 7 days)
    const last7 = getLastNDates(7);
    const start = last7[0];
    const end = new Date(last7[last7.length - 1]);
    end.setDate(end.getDate() + 1);

    const dailyCounts = await Feedback.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailyMap = new Map(dailyCounts.map((d) => [d._id, d.count]));
    const weeklyOrderData = last7.map((d) => {
      const key = d.toISOString().slice(0, 10);
      const day = d.toLocaleDateString('en-US', { weekday: 'long' });
      return { day, orders: dailyMap.get(key) || 0 };
    });

    // Citizens (users) with submissions and avg rating per user
    const perUserStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$user',
          submissions: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);
    const statsMap = new Map(perUserStats.map((s) => [String(s._id), s]));

    const users = await User.find({}, 'name email isVerified').lean();
    const citizens = users.map((u) => {
      const s = statsMap.get(String(u._id));
      return {
        id: u._id,
        name: u.name,
        email: u.email,
        status: u.isVerified ? 'Verified' : 'Unverified',
        submissions: s?.submissions || 0,
        rating: s?.avgRating ? Math.round(s.avgRating * 10) / 10 : 0,
        progress: Math.min(100, (s?.submissions || 0) * 10),
      };
    });

    // Recent feedback list
    const feedback = await Feedback.find()
      .populate('user', 'name')
      .sort({ date: -1 })
      .limit(20)
      .lean();

    const feedbackList = feedback.map((f) => ({
      id: f._id,
      citizen: f.user?.name || 'Anonymous',
      rating: f.rating,
      sector: 'General', // placeholder – adjust if you add sector field later
      ticket: f._id.toString().slice(-6),
      date: f.date,
    }));

    res.json({
      metrics: {
        totalFeedback,
        averageRating: Math.round(averageRating * 10) / 10,
      },
      weeklyOrderData,
      citizens,
      feedback: feedbackList,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Failed to load dashboard', error: err.message });
  }
};
