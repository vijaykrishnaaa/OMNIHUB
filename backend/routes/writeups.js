const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const WriteUp = require('../models/WriteUp');

router.get('/', async (req, res) => {
    try {
        const writeUps = await WriteUp.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        res.json(writeUps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const stats = await WriteUp.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
        const formattedStats = stats.reduce((acc, item) => {
            if (item._id) { acc[item._id] = item.count; }
            return acc;
        }, {});
        res.json(formattedStats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
  try {
    const { title, subtitle, category, content, tags, author } = req.body;
    if (!title || !category || !content || !author) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }
    const newWriteUp = new WriteUp({ title, subtitle, category, content, tags, author });
    await newWriteUp.save();
    const populatedWriteUp = await WriteUp.findById(newWriteUp._id).populate('author', 'username');
    res.status(201).json(populatedWriteUp);
  } catch (err) { 
    res.status(500).json({ message: 'Server error while creating write-up.' });
   }
});

router.put('/:id', async (req, res) => {
  try {
    const writeUp = await WriteUp.findById(req.params.id);
    if (!writeUp) return res.status(404).json({ message: 'Write-up not found' });
    if (writeUp.author.toString() !== req.body.author) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    const { title, subtitle, category, content, tags } = req.body;
    const updatedWriteUp = await WriteUp.findByIdAndUpdate(req.params.id, { title, subtitle, category, content, tags }, { new: true });
    res.json(updatedWriteUp);
  } catch (err) { 
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const writeUp = await WriteUp.findById(req.params.id);
    if (!writeUp) return res.status(404).json({ message: 'Write-up not found' });
    if (writeUp.author.toString() !== req.body.author) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    await WriteUp.findByIdAndDelete(req.params.id);
    res.json({ message: 'Write-up deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;