const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const mongoose = require('mongoose');

router.get('/stats', async (req, res) => {
    try {
        const stats = await Review.aggregate([
            { $group: { _id: '$rating', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching review stats' });
    }
});

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorInfo'
        }
      },
      { $unwind: { path: '$authorInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          movieName: 1,
          pros: 1,
          cons: 1,
          hasSpoilers: 1,
          rating: 1,
          createdAt: 1,
          author: {
            _id: '$authorInfo._id',
            username: '$authorInfo.username'
          },
          commentCount: { $size: { $ifNull: ['$comments', []] } }
        }
      }
    ]);
    res.json(reviews);
  } catch (err) { 
      console.error("Error fetching reviews:", err);
      res.status(500).json({ message: err.message }); 
    }
});

router.post('/', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const review = await newReview.save();
    const populatedReview = await Review.findById(review._id).populate('author', ['username']);
    res.status(201).json(populatedReview);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.author.toString() !== req.body.authorId) {
        return res.status(401).json({ message: 'User not authorized' });
    }
    const { movieName, rating, pros, cons, hasSpoilers } = req.body;
    review.movieName = movieName;
    review.rating = rating;
    review.pros = pros;
    review.cons = cons;
    review.hasSpoilers = hasSpoilers;

    const updatedReview = await review.save();
    const populatedReview = await Review.findById(updatedReview._id).populate('author', ['username']);
    res.json(populatedReview);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.author.toString() !== req.body.authorId) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;