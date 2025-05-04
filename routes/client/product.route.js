const express = require('express');
const router = express.Router();
const productController = require('../../controllers/client/product.controller');

// Route cho trang chi tiết sản phẩm (sử dụng id trong URL)
router.get('/:id', productController.show);

// Route cho tìm kiếm sản phẩm
router.get('/search', productController.search);

module.exports = router;
