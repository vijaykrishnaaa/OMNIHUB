const express = require('express');
const router = express.Router();
const Share = require('../models/Share');

router.post('/', async (req, res) => {
    const { recipientEmail, senderName, senderEmail, subject, message, sharedBy, writeUpId } = req.body;

    if (!recipientEmail || !sharedBy || !writeUpId) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }
    try {
        const newShare = new Share({
            recipientEmail, senderName, senderEmail, subject, message,
            sharedBy,
            writeUp: writeUpId
        });
        await newShare.save();
        res.status(201).json({ message: 'Shared successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error sharing write-up.' });
    }
});

module.exports = router;