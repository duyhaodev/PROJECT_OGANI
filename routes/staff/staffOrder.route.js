const express = require ("express");
const router = express.Router();
const staffOrderController =  require ("../../controllers/staff/staffOrder.controller")

router.get("/", staffOrderController.orderStaff); // Route danh sách đơn hàng
router.get("/:id", staffOrderController.getOrderDetail); // Route chi tiết đơn hàng
router.post("/:id/status", staffOrderController.updateOrderStatus);
router.post("/apply-bulk-action", staffOrderController.applyBulkAction);

module.exports = router;
