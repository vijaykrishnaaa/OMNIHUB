const express = require('express');
const router = express.Router();
const ArticleReview = require('../models/ArticleReview');

router.post('/', async (req, res) => {
    const { isHelpful, helpfulFeedback, updateSuggestion, clarityRating, accuracyRating, articleId, authorId } = req.body;

    if (isHelpful === undefined || !articleId || !authorId) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        const newReview = new ArticleReview({
            isHelpful,
            helpfulFeedback,
            updateSuggestion,
            clarityRating,
            accuracyRating,
            article: articleId,
            author: authorId,
        });
        await newReview.save();
        res.status(201).json({ message: 'Article review submitted successfully.' });
    } catch (error) {
        console.error("ERROR Submitting Article Review:", error);
        res.status(500).json({ message: 'Error submitting review.' });
    }
});

module.exports = router;