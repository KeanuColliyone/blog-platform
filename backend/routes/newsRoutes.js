const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const router = express.Router();

// Fetch latest anime news
router.get('/latest', async (req, res) => {
  try {
    // Fetch data from Anime News Network
    const response = await axios.get('https://api.animenewsnetwork.com/encyclopedia/reports.xml', {
      params: { id: 155 }, // Adjusted API endpoint and parameters
    });

    // Parse the XML data
    const parser = new xml2js.Parser({ explicitArray: false });
    parser.parseString(response.data, (err, result) => {
      if (err) {
        console.error('[XML Parsing Error]', err);
        return res.status(500).json({ message: 'Failed to parse anime news data', error: err.message });
      }

      // Extract relevant data from parsed JSON
      const newsItems = result.report.item.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        vintage: item.vintage || 'Unknown',
        precision: item.precision || 'Unknown',
      }));

      res.status(200).json(newsItems);
    });
  } catch (error) {
    console.error(`[GET /news/latest] Error: ${error.message}`);
    res.status(error.response?.status || 500).json({
      message: 'Failed to fetch anime news',
      error: error.message,
    });
  }
});

module.exports = router;