const express = require('express');
const router = express.Router();
const infoController = require('../../controllers/client/info.controller')

// router.use('/:slug', infoController.show);
router.use('/', infoController.showInfo);

module.exports = router;