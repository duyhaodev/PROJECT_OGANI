const express = require ("express");
const router = express.Router();
const AdminCateController =  require ("../../controllers/admin/category.controller")

router.get("/", AdminCateController.category)

module.exports = router;
