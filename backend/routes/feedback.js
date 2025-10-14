const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.get('/', async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbackList);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFeedback);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;