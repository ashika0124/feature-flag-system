const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const authController = require('../controllers/authController');
const flagController = require('../controllers/featureFlagController');

router.post('/login', authController.endUserLogin);

router.post('/check-flag', verifyToken, checkRole(['end_user']), flagController.checkFlag);

module.exports = router;