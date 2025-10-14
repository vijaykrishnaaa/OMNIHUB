
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  feedbackType: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['New', 'Under Review', 'Resolved', 'Closed'], 
    default: 'New' 
  },
  adminNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);