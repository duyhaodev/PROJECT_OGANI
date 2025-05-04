const express = require("express");
const router = express.Router();
const ProductController = require('../../controllers/client/product.controller');

router.get("/search", ProductController.searchProduct);
module.exports = router;
