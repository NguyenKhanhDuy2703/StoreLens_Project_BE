const express = require('express');
const router = express.Router();
const  product = require("../controllers/productController")

router.post('/', product.createProduct);
router.get('/', product.getProducts);
router.put('/:id', product.updateProduct);
router.delete('/:id', product.deleteProduct);
router.post('/bulk-delete', product.bulkDeleteProducts);

module.exports = router;

