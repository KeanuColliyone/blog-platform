const express = require('express');
const axios = require('axios');
const router = express.Router();

// Fetch latest anime news
router.get('/latest', async (req, res) => {
  try {
    // Fetch news from Anime News Network
    const response = await axios.get('https://api.animenewsnetwork.com/v1/latest-news', {
      params: { limit: 10 }, // Fetch the top 10 news articles
    });

    // Check if the response contains data
    if (response.data) {
      res.status(200).json(response.data);
    } else {
      res.status(404).json({ message: 'No news found' });
    }
  } catch (error) {
    console.error(`[GET /news/latest] Error: ${error.message}`);
    res.status(error.response?.status || 500).json({
      message: 'Failed to fetch anime news',
      error: error.message,
    });
  }
});

module.exports = router;