const express = require ("express");
const router = express.Router();
const AdminProductController =  require ("../../controllers/admin/product.controller")

router.get("/", AdminProductController.index)

module.exports = router;
