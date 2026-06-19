const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// GET /api/sessions
router.get('/sessions', sessionController.getSessions);

module.exports = router;
