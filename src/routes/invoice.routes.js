const express = require('express');
const router = express.Router();
const uploadExcel = require('../middlewares/uploadExcelMiddleware');
const invoiceController = require('../controllers/invoiceController');

// POST: /api/invoices/import
router.post('/import',  uploadExcel.single('file'), 
    invoiceController.importInvoices
);

module.exports = router;