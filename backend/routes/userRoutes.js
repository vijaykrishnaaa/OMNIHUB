const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const User = require('../models/User');
const Content = require('../models/Content');

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id/content-stats', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const stats = await Content.aggregate([
            { $match: { uploadedBy: new mongoose.Types.ObjectId(req.params.id) } },
            { $group: { _id: '$contentType', count: { $sum: 1 } } }
        ]);

        const formattedStats = stats.reduce((acc, item) => {
            if (item._id) {
                acc[item._id] = item.count;
            }
            return acc;
        }, {});

        res.json(formattedStats);
    } catch (error) {
        console.error('Error fetching content stats:', error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

module.exports = router;