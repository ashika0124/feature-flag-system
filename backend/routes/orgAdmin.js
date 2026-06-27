const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const authController = require('../controllers/authController');
const flagController = require('../controllers/featureFlagController');

router.post('/signup', authController.orgAdminSignup);

router.post('/login', authController.orgAdminLogin);

router.get('/flags', verifyToken, checkRole(['org_admin']), flagController.getFlags);

router.post('/flags', verifyToken, checkRole(['org_admin']), flagController.createFlag);

router.put('/flags/:flagId', verifyToken, checkRole(['org_admin']), flagController.updateFlag);

router.delete('/flags/:flagId', verifyToken, checkRole(['org_admin']), flagController.deleteFlag);

module.exports = router;