const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleReviewSchema = new Schema({
    isHelpful: {
        type: Boolean,
        required: true
    },
    helpfulFeedback: {
        type: String
    },
    updateSuggestion: {
        type: String
    },
    clarityRating: {
        type: Number,
        min: 1,
        max: 5
    },
    accuracyRating: {
        type: Number,
        min: 1,
        max: 5
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ArticleReview', ArticleReviewSchema);