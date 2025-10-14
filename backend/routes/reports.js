const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

router.post('/', async (req, res) => {
    const { reason, reportingUserId, reportedReviewId } = req.body;

    if (!reason || !reportingUserId || !reportedReviewId) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        const newReport = new Report({
            reason: reason,
            reportingUser: reportingUserId,
            reportedReview: reportedReviewId
        });
        await newReport.save();
        res.status(201).json({ message: 'Report submitted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting report.' });
    }
});

module.exports = router;