const express = require('express');
const router = express.Router();

const { loginController, registerController, logoutController } = require('../controllers/authController');

// POST /api/v1/auth/login
router.post('/login', loginController);
router.post('/register', registerController);
router.post('/logout', logoutController);

module.exports = router;
