const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// GET /api/sessions
router.get('/sessions', sessionController.getSessions);

// GET /api/sessions/:sessionId/events
router.get('/sessions/:sessionId/events', sessionController.getSessionEvents);

module.exports = router;
