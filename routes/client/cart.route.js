const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/client/cart.controller')

// router.use('/:slug', cartController.show);
router.get('/', cartController.showCart);

module.exports = router;