const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

router.post('/', async (req, res) => {
  try {
    const newContent = new Content(req.body);
    const savedContent = await newContent.save();
    res.status(201).json(savedContent);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:type', async (req, res) => {
  try {
    const content = await Content.find({ contentType: req.params.type })
                                  .populate('uploadedBy', ['username'])
                                  .sort({ createdAt: -1 });
    res.json(content);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/:id', async (req, res) => {
    try {
      const updatedContent = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedContent) return res.status(404).json({ message: 'Content not found' });
      res.json(updatedContent);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedContent = await Content.findByIdAndDelete(req.params.id);
        if (!deletedContent) return res.status(404).json({ message: 'Content not found' });
        res.json({ message: 'Content deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;