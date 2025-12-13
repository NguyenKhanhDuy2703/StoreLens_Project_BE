const express = require('express');
const router = express.Router();
const { getAllUsers, banUser, activateUser  , getStoreForUser } = require('../controllers/userController');
router.get("/getAll", getAllUsers);
router.patch("/ban/:id", banUser);
router.patch("/activate/:id", activateUser);
router.get("/store", getStoreForUser);
module.exports = router;