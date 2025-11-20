const express = require('express');
const router = express.Router();

const { getAllStores } = require('../controllers/storesController');
router.get('/getAllStores', getAllStores);
module.exports = router;