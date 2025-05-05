const express = require ("express");
const router = express.Router();
const AdminCateController =  require ("../../controllers/admin/category.controller")

router.get("/", AdminCateController.category)
router.get("/add", AdminCateController.addForm); 
router.post("/insert", AdminCateController.addSave); 
router.get("/delete/:id", AdminCateController.delete);
router.get("/view/:id", AdminCateController.viewProductsByCategory);
module.exports = router;
