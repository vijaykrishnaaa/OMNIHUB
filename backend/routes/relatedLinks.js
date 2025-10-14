const express = require('express');
const router = express.Router();
const RelatedLink = require('../models/RelatedLink');

router.get('/', async (req, res) => {
    try {
        const links = await RelatedLink.find()
            .populate('submittedBy', 'username')
            .populate('relatedContent', 'title contentType')
            .sort({ createdAt: 'desc' });
        res.json(links);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching links.' });
    }
});

router.post('/', async (req, res) => {
    const { url, title, linkType, description, containsSpoilers, submittedBy, relatedContent } = req.body;
    if (!url || !title || !linkType || !submittedBy || !relatedContent) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }
    try {
        const newLink = new RelatedLink({ url, title, linkType, description, containsSpoilers, submittedBy, relatedContent });
        await newLink.save();
        res.status(201).json({ message: 'Link submitted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting link.' });
    }
});

router.put('/:id', async (req, res) => {
    const { url, title, linkType, description, containsSpoilers, userId } = req.body;
    try {
        const link = await RelatedLink.findById(req.params.id);
        if (!link) return res.status(404).json({ message: "Link not found" });

        if (link.submittedBy.toString() !== userId) {
            return res.status(401).json({ message: "User not authorized" });
        }
        
        link.url = url;
        link.title = title;
        link.linkType = linkType;
        link.description = description;
        link.containsSpoilers = containsSpoilers;
        
        const updatedLink = await link.save();
        res.json(updatedLink);
    } catch (error) {
        res.status(500).json({ message: 'Error updating link.' });
    }
});

router.delete('/:id', async (req, res) => {
    const { userId } = req.body;
    try {
        const link = await RelatedLink.findById(req.params.id);
        if (!link) return res.status(404).json({ message: "Link not found" });

        if (link.submittedBy.toString() !== userId) {
            return res.status(401).json({ message: "User not authorized" });
        }
        
        await RelatedLink.findByIdAndDelete(req.params.id);
        res.json({ message: 'Link deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting link.' });
    }
});

module.exports = router;