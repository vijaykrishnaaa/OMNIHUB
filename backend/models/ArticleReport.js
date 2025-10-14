const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleReportSchema = new Schema({
    reason: {
        type: String,
        required: true,
        enum: ['Incorrect Information', 'Outdated Content', 'Spam', 'Other']
    },
    details: {
        type: String
    },
    urgency: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    problematicSection: {
        type: String
    },
    sourceLink: {
        type: String
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    reportingUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ArticleReport', ArticleReportSchema);