const express = require('express');
const router = express.Router();
const catalogController = require('../../controllers/client/catalog.controller');

// Đặt route cụ thể lên trước
router.get('/api/catalog', catalogController.getAll);

// Route trang chính danh mục
router.get('/catalog', catalogController.index);

// Route động - tên danh mục
router.get('/catalog/:nameCat', catalogController.show);


module.exports = router;
