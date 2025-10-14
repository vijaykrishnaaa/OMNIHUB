const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  movieName: { type: String, required: true },
  pros: { type: String },
  cons: { type: String },
  hasSpoilers: { type: Boolean, default: false },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 10 
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  comments: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Comment' 
  }],
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);