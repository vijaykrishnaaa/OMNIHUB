const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShareSchema = new Schema({
    recipientEmail: { type: String, required: true },
    senderName: { type: String },
    senderEmail: { type: String },
    subject: { type: String },
    message: { type: String },
    sharedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    writeUp: { type: Schema.Types.ObjectId, ref: 'WriteUp', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Share', ShareSchema);