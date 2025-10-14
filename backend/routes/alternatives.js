const express = require('express');
const router = express.Router();
const Alternative = require('../models/Alternative');

router.post('/', async (req, res) => {
    const { contentName, contentType, reason, link, genre, suggestedById, originalReviewId } = req.body;
    if (!contentName || !contentType || !suggestedById || !originalReviewId) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }
    try {
        const newAlternative = new Alternative({
            contentName,
            contentType,
            reason,
            link,
            genre,
            suggestedBy: suggestedById,
            originalReview: originalReviewId
        });
        await newAlternative.save();
        res.status(201).json({ message: 'Suggestion submitted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting suggestion.' });
    }
});

module.exports = router;