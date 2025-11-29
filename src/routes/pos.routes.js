const express = require('express');
const router = express.Router();
const {postInvoiceController} = require('../controllers/posController');

router.post('/invoices', postInvoiceController);
module.exports = router;