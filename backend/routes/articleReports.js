const express = require('express');
const router = express.Router();
const ArticleReport = require('../models/ArticleReport');

router.post('/', async (req, res) => {
    const { reason, details, urgency, problematicSection, sourceLink, articleId, reportingUserId } = req.body;
    if (!reason || !articleId || !reportingUserId) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        const newReport = new ArticleReport({
            reason,
            details,
            urgency,
            problematicSection,
            sourceLink,
            article: articleId,
            reportingUser: reportingUserId
        });
        await newReport.save();
        res.status(201).json({ message: 'Report submitted successfully.' });
    } catch (error) {
        console.error("ERROR Submitting Article Report:", error);
        res.status(500).json({ message: 'Error submitting report.' });
    }
});

module.exports = router;