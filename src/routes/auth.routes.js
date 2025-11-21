const express = require('express');
const router = express.Router();
const { loginController, registerController, logoutController } = require('../controllers/authController');
router.post('/login', loginController);
router.post('/register', registerController);
router.get('/logout', logoutController);

module.exports = router;
