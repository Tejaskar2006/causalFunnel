const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// POST /api/events
router.post('/events', eventController.trackEvent);

// GET /api/heatmap/urls
router.get('/heatmap/urls', eventController.getClickUrls);

// GET /api/heatmap
router.get('/heatmap', eventController.getHeatmapData);

module.exports = router;
