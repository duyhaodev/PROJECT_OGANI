const express = require ("express");
const router = express.Router();
const AdminCustomercontroller =  require ("../../controllers/admin/customer.controller")

router.get("/", AdminCustomercontroller.customer)
router.get("/lock/:id", AdminCustomercontroller.lockCustomer);
router.get("/unlock/:id", AdminCustomercontroller.unlockCustomer);
router.get("/view/:id", AdminCustomercontroller.viewCustomer);
module.exports = router;
