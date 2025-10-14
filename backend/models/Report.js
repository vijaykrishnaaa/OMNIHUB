const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    reason: {
        type: String,
        required: true,
        enum: ['Spam', 'Inappropriate Content', 'Harassment', 'Other']
    },
    details: {
        type: String
    },
    urgency: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    linkToEvidence: {
        type: String
    },
    reportingUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportedReview: {
        type: Schema.Types.ObjectId,
        ref: 'Review',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);