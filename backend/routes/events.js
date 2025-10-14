const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.get('/', async (req, res) => {
    try {
        const events = await Event.find()
            .populate('createdBy', 'username')
            .populate('relatedContent', 'title imageUrl contentType')
            .sort({ eventDate: 'asc' });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events.' });
    }
});

router.post('/', async (req, res) => {
    const { title, eventDate, description, eventType, capacity, createdBy, relatedContent } = req.body;
    if (!title || !eventDate || !eventType || !createdBy || !relatedContent) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }
    try {
        const newEvent = new Event({ title, eventDate, description, eventType, capacity, createdBy, relatedContent });
        await newEvent.save();
        res.status(201).json({ message: 'Event scheduled successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error scheduling event.' });
    }
});

router.put('/:id', async (req, res) => {
    const { title, eventDate, description, eventType, capacity, userId } = req.body;
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.createdBy.toString() !== userId) {
            return res.status(401).json({ message: "User not authorized" });
        }
        
        event.title = title;
        event.eventDate = eventDate;
        event.description = description;
        event.eventType = eventType;
        event.capacity = capacity;
        
        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event.' });
    }
});

router.delete('/:id', async (req, res) => {
    const { userId } = req.body;
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.createdBy.toString() !== userId) {
            return res.status(401).json({ message: "User not authorized" });
        }
        
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event.' });
    }
});

module.exports = router;