const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    questionText: { type: String, required: true },
    isPublic: { type: Boolean, default: true },
    topic: { type: String },
    subject: { type: String },
    askerEmail: { type: String },
    referenceText: { type: String },
    asker: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    review: { type: Schema.Types.ObjectId, ref: 'Review', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);