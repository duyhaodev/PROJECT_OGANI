const express = require("express");
const router = express.Router();
const productController = require("../../controllers/admin/product.controller");
const csrfProtection = require('../../middleware/csrf.middleware');

router.get("/add", productController.showAddForm);
router.post("/add", productController.addProduct);
router.post("/lock/:importId", csrfProtection, productController.lockByImport);
router.post("/unlock/:importId",csrfProtection, productController.unlockByImport);
router.get("/edit/:importId", productController.showEditForm);
router.post("/update/:importId", productController.updateByImport);
router.post("/delete/:importId", csrfProtection, productController.deleteByImport);
module.exports = router;
