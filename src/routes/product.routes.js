const express = require('express');
const router = express.Router();
const  product = require("../controllers/productController")
router.get('/', product.getListProducts);
router.get('/categories', product.getListCategories);
module.exports = router;

