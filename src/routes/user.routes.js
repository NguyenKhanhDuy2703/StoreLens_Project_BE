const express = require('express');
const router = express.Router();
const { getAllUsers, banUser, activateUser } = require('../controllers/userController');
// Lấy danh sách user
router.get("/getAll", getAllUsers);
// Ban user (status = inactive)
router.patch("/ban/:id", banUser);
// Kích hoạt user (status = active)
router.patch("/activate/:id", activateUser);
module.exports = router;