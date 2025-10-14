const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WriteUpRatingSchema = new Schema({
    clarity: { type: Number, min: 1, max: 5 },
    accuracy: { type: Number, min: 1, max: 5 },
    engagement: { type: Number, min: 1, max: 5 },
    recommend: { type: Boolean },
    justification: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    writeUp: { type: Schema.Types.ObjectId, ref: 'WriteUp', required: true }
}, { timestamps: true });

module.exports = mongoose.model('WriteUpRating', WriteUpRatingSchema);