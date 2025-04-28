const express = require ("express");
const router = express.Router();
const AdminStaffcontroller =  require ("../../controllers/admin/staff.controller")

router.get("/", AdminStaffcontroller.staff)

module.exports = router;
