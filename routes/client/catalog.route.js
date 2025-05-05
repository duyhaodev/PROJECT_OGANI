const express = require('express');
const router = express.Router();
const catalogController = require('../../controllers/client/catalog.controller');


// Route trang chính danh mục
router.get('/catalog', catalogController.index);

// Route động - tên danh mục
router.get('/catalog/:categoryName', catalogController.show);


module.exports = router;
