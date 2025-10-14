const express = require('express');
const router = express.Router();
const WriteUpRating = require('../models/WriteUpRating');

router.post('/', async (req, res) => {
    const { clarity, accuracy, engagement, recommend, justification, authorId, writeUpId } = req.body;
    if (recommend === undefined || !authorId || !writeUpId) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }
    try {
        const newRating = new WriteUpRating({
            clarity, accuracy, engagement, recommend, justification,
            author: authorId,
            writeUp: writeUpId
        });
        await newRating.save();
        res.status(201).json({ message: 'Rating submitted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting rating.' });
    }
});

module.exports = router;