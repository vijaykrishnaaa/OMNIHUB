const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlternativeSchema = new Schema({
    contentName: { type: String, required: true },
    contentType: { type: String, required: true },
    reason: { type: String },
    link: { type: String },
    genre: { type: String },
    suggestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    originalReview: { type: Schema.Types.ObjectId, ref: 'Review', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Alternative', AlternativeSchema);