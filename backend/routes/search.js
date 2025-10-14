const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const User = require('../models/User');

router.get('/', async (req, res) => {
  const { q, filter } = req.query;
  if (!q) {
    return res.json([]);
  }

  const queryRegex = new RegExp(q, 'i');

  try {
    const query = {
      $or: [
        { title: queryRegex },
        { description: queryRegex },
        { author_director: queryRegex },
        { genre_category: queryRegex },
      ],
    };

    if (filter && filter !== 'all') {
      query.contentType = filter;
    }

    const results = await Content.find(query)
                                  .populate('uploadedBy', 'username')
                                  .limit(20);
    
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});

module.exports = router;