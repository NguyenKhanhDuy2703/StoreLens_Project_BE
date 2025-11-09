const express = require('express');
const router = express.Router();

const { loginController } = require('../controllers/loginController');

// POST /api/v1/auth/login
router.post('/login', loginController);

module.exports = router;
