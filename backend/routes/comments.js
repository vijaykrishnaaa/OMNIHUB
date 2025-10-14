const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Review = require('../models/Review');
const mongoose = require('mongoose');

router.get('/review/:reviewId', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.reviewId)) {
            return res.status(400).json({ message: 'Invalid Review ID' });
        }
        const comments = await Comment.find({ review: req.params.reviewId })
            .populate('author', 'username')
            .sort({ createdAt: 'asc' });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments.' });
    }
});

router.post('/', async (req, res) => {
    const { text, authorId, reviewId } = req.body;
    if (!text || !authorId || !reviewId) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        const newComment = new Comment({
            text: text,
            author: authorId,
            review: reviewId
        });
        const savedComment = await newComment.save();

        await Review.findByIdAndUpdate(reviewId, {
            $push: { comments: savedComment._id }
        });

        const populatedComment = await Comment.findById(savedComment._id).populate('author', 'username');
        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating comment.' });
    }
});

router.put('/:id', async (req, res) => {
    const { text, authorId } = req.body;
    if (!text || !authorId) {
        return res.status(400).json({ message: 'Missing text or author ID' });
    }
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.author.toString() !== authorId) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        comment.text = text;
        await comment.save();
        const populatedComment = await Comment.findById(comment._id).populate('author', 'username');
        res.json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment' });
    }
});

router.delete('/:id', async (req, res) => {
    const { authorId } = req.body;
     if (!authorId) {
        return res.status(400).json({ message: 'Missing author ID' });
    }
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.author.toString() !== authorId) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Review.findByIdAndUpdate(comment.review, {
            $pull: { comments: comment._id }
        });
        
        await Comment.findByIdAndDelete(req.params.id);

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment' });
    }
});


module.exports = router;