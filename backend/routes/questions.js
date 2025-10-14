const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

router.post('/', async (req, res) => {
    const { questionText, isPublic, topic, subject, askerEmail, referenceText, askerId, reviewId } = req.body;
    if (!questionText || !askerId || !reviewId) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }
    try {
        const newQuestion = new Question({
            questionText,
            isPublic,
            topic,
            subject,
            askerEmail,
            referenceText,
            asker: askerId,
            review: reviewId
        });
        await newQuestion.save();
        res.status(201).json({ message: 'Question submitted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting question.' });
    }
});

module.exports = router;