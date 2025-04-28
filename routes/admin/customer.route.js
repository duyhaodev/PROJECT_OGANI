const express = require ("express");
const router = express.Router();
const AdminCustomercontroller =  require ("../../controllers/admin/customer.controller")

router.get("/", AdminCustomercontroller.customer)

module.exports = router;
