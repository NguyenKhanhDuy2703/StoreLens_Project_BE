const express = require('express');
const router = express.Router();
const {exportStoreReport} = require('../controllers/reportController');
router.post('/export', exportStoreReport);

module.exports = router;