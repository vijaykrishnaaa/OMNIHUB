const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    title: { type: String, required: true },
    eventDate: { type: Date, required: true },
    description: { type: String },
    eventType: {
        type: String,
        enum: ['Watch Party', 'Book Club', 'Live Discussion', 'Q&A Session'],
        required: true
    },
    capacity: {
        type: Number
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    relatedContent: { type: Schema.Types.ObjectId, ref: 'Content', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);