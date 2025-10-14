const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WriteUpSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  category: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model('WriteUp', WriteUpSchema);