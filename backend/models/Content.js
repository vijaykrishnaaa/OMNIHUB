const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContentSchema = new Schema({
  contentType: {
    type: String,
    enum: ['Movie', 'Book', 'Video'],
    required: true,
  },
  title: { type: String, required: true },
  author_director: { type: String },
  genre_category: { type: String },
  description: { type: String },
  imageUrl: { type: String, required: true },
  watchUrl: { type: String },
  trailerUrl: { type: String },
  rating: { type: Number },
  duration: { type: String },
  releaseYear: { type: Number },
  cast: [String],
  pages: { type: Number },
  reviews: { type: Number, default: 0 },
  channel: { type: String },
  views: { type: String },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Content', ContentSchema);