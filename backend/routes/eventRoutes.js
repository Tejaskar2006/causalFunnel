const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// POST /api/events
router.post('/events', eventController.trackEvent);

module.exports = router;
