const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const authController = require('../controllers/authController');
const orgController = require('../controllers/organizationController');

router.post('/login', authController.superAdminLogin);

router.post('/organizations', verifyToken, checkRole(['super_admin']), orgController.createOrganization);

router.get('/organizations', verifyToken, checkRole(['super_admin']), orgController.getOrganizations);

module.exports = router;