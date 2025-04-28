const express = require("express");
const router = express.Router();
const WaitingController = require("../controllers/waiting.controller");

// Route GET /waiting
router.get("/waiting", WaitingController.waiting);

module.exports = router;