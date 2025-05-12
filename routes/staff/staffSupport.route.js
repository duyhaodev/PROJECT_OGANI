const express = require ("express");
const router = express.Router();
const staffSupportController =  require ("../../controllers/staff/support.controller")

router.get("/", staffSupportController.support)

router.post("/reply", staffSupportController.replySupport); 

module.exports = router;
