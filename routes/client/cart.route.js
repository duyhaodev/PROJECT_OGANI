const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/client/cart.controller')

router.get('/count', cartController.getCartCount);

router.get('/remove/:itemId', cartController.removeItem);

router.post('/update/:itemId', cartController.updateItemQuantity);

router.post('/add/:productId', cartController.addToCart);

router.get('/:id', cartController.showCart);

router.get('/', cartController.showCart);

module.exports = router;