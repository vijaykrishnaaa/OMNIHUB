const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
router.get('/stats', async (req, res) => {
    try {
        const stats = await Article.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const formattedStats = stats.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});
        
        res.json(formattedStats);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching stats' });
    }
});

router.post('/', async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    const article = await newArticle.save();
    res.status(201).json(article);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(article);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;