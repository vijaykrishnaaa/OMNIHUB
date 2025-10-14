const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RelatedLinkSchema = new Schema({
    url: { type: String, required: true },
    title: { type: String, required: true },
    linkType: {
        type: String,
        enum: ['Video Essay', 'Fan Theory', 'Podcast Discussion', 'Article'],
        required: true
    },
    description: { type: String },
    containsSpoilers: { type: Boolean, default: false },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    relatedContent: { type: Schema.Types.ObjectId, ref: 'Content', required: true }
}, { timestamps: true });

module.exports = mongoose.model('RelatedLink', RelatedLinkSchema);