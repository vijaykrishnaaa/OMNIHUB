const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');

router.get('/user/:userId', async (req, res) => {
    try {
        const collections = await Collection.find({ owner: req.params.userId }).select('name');
        res.json(collections);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching collections.' });
    }
});

router.get('/details/:userId', async (req, res) => {
    try {
        const collections = await Collection.find({ owner: req.params.userId })
            .populate({
                path: 'items.content',
                model: 'Content'
            });
        res.json(collections);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching collection details.' });
    }
});

router.post('/add', async (req, res) => {
    const { collectionId, collectionName, contentId, note, userId, description, tags } = req.body;
    
    try {
        let targetCollection;
        if (collectionId) {
            targetCollection = await Collection.findById(collectionId);
        } else if (collectionName) {
            const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
            targetCollection = new Collection({ 
                name: collectionName, 
                owner: userId, 
                items: [],
                description: description,
                tags: tagArray
            });
        } else {
            return res.status(400).json({ message: 'Collection name or ID is required.' });
        }

        if (!targetCollection) return res.status(404).json({ message: 'Collection not found.' });

        targetCollection.items.push({ content: contentId, note: note });
        await targetCollection.save();
        res.status(200).json({ message: 'Added to collection successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding to collection.' });
    }
});

router.put('/:id', async (req, res) => {
    const { name } = req.body;
    try {
        const collection = await Collection.findByIdAndUpdate(req.params.id, { name }, { new: true });
        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Error updating collection name.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Collection.findByIdAndDelete(req.params.id);
        res.json({ message: 'Collection deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting collection.' });
    }
});

router.put('/:collectionId/item/:itemId', async (req, res) => {
    const { note } = req.body;
    try {
        const collection = await Collection.findOneAndUpdate(
            { "_id": req.params.collectionId, "items._id": req.params.itemId },
            { "$set": { "items.$.note": note } },
            { new: true }
        );
        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Error updating item note.' });
    }
});

router.delete('/:collectionId/item/:itemId', async (req, res) => {
    try {
        await Collection.findByIdAndUpdate(req.params.collectionId, {
            $pull: { items: { _id: req.params.itemId } }
        });
        res.json({ message: 'Item removed from collection.' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item.' });
    }
});

module.exports = router;