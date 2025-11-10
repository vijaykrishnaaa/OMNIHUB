const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('API is running...'));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/content', require('./routes/content'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/writeups', require('./routes/writeups'));
app.use('/api/search', require('./routes/search'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/articlereviews', require('./routes/articleReviews'));
app.use('/api/shares', require('./routes/shares'));
app.use('/api/edit-suggestions', require('./routes/editSuggestions'));
app.use('/api/writeup-ratings', require('./routes/writeupRatings'));
app.use('/api/collections', require('./routes/collections'));
app.use('/api/events', require('./routes/events'));
app.use('/api/related-links', require('./routes/relatedLinks'));
app.use('/api/articlereports', require('./routes/articleReports'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/alternatives', require('./routes/alternatives'));

// --- THESE ARE THE MISSING ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    user = new User({ username, email, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json({ message: 'Account created successfully! Please log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const userData = { id: user._id, username: user.username, email: user.email, role: user.role };
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = app;
