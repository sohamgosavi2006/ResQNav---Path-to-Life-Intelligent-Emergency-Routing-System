const express = require('express');
const router = express.Router();
const { validateIncident, logSMS, receiveSMS, getLogs } = require('../controllers/verificationController');

// Define Routes
router.post('/validate', validateIncident);
router.post('/log-sms', logSMS);
router.post('/receive-sms', receiveSMS);
router.get('/logs', getLogs);

module.exports = router;
