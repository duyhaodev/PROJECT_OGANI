// In routes/client/cart.route.js
const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/client/cart.controller');

// Public route - doesn't need CSRF
router.get('/count', cartController.getCartCount);

// Protected routes - require CSRF
router.post('/remove/:itemId', cartController.removeItem);
router.post('/update/:itemId', cartController.updateItemQuantity);
router.post('/add/:productId', cartController.addToCart);

// View routes - don't need CSRF
router.get('/:id', cartController.showCart);
router.get('/', cartController.showCart);

module.exports = router;