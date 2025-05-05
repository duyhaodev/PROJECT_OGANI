const express = require('express');
const router = express.Router();
const productController = require('../../controllers/client/product.controller');

// Route cho trang chi tiết sản phẩm (sử dụng id trong URL)
router.get('/:slug', productController.show);

module.exports = router;
