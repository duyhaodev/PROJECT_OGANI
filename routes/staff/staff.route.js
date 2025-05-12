const express = require ("express");
const router = express.Router();
const StaffController =  require ("../../controllers/staff/staff.controller")

router.get("/", StaffController.index)

module.exports = router;
