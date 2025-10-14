
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Normal User' },
  fullName: { type: String, default: 'Guest' },
  bio: { type: String, default: 'Welcome to OmniHub!' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);