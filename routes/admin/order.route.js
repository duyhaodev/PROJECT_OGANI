const express = require ("express");
const router = express.Router();
const AdminOrdercontroller =  require ("../../controllers/admin/order.controller")

router.get("/", AdminOrdercontroller.order)

module.exports = router;
