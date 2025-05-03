const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/staff.controller");

router.get("/", controller.staff);
router.get("/lock/:id", controller.lock);
router.get("/unlock/:id", controller.unlock);
router.get("/delete/:id", controller.delete);
router.get("/edit/:id", controller.editForm);
router.post("/update/:id", controller.editSave);
router.get("/add", controller.addForm);
router.post("/insert", controller.addSave);
router.get("/view/:id", controller.viewStaff);
module.exports = router;
