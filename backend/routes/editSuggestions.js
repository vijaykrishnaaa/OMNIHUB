const express = require('express');
const router = express.Router();
const EditSuggestion = require('../models/EditSuggestion');

router.post('/', async (req, res) => {
    const { suggestionType, problematicSection, suggestionText, sourceLink, suggestedBy, writeUpId } = req.body;
    if (!suggestionType || !suggestionText || !suggestedBy || !writeUpId) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }
    try {
        const newSuggestion = new EditSuggestion({
            suggestionType, problematicSection, suggestionText, sourceLink,
            suggestedBy,
            writeUp: writeUpId,
        });
        await newSuggestion.save();
        res.status(201).json({ message: 'Suggestion submitted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting suggestion.' });
    }
});

module.exports = router;