const express = require('express');
const router = express.Router();
const {postInvoiceController , addProductsController} = require('../controllers/posController');

router.post('/invoices', postInvoiceController);
router.post('/products' , addProductsController)
module.exports = router;