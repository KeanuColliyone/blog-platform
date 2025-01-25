const express = require('express');
const axios = require('axios'); // For making HTTP requests
const router = express.Router();

// Replace with your chosen API URL
const ANIME_NEWS_API_URL = 'https://api.animenewsnetwork.com/v1/latest-news';

router.get('/latest', async (req, res) => {
  try {
    const response = await axios.get(ANIME_NEWS_API_URL);
    const news = response.data.articles.slice(0, 10); // Get the top 10 latest news
    res.json(news);
  } catch (error) {
    console.error('Error fetching anime news:', error.message);
    res.status(500).json({ message: 'Failed to fetch anime news' });
  }
});

module.exports = router;