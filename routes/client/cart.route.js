const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/client/cart.controller');
const { csrfMiddleware } = require('../../middleware/csrf.middleware');

// Apply CSRF protection to all routes
router.use(csrfMiddleware);

// Public route - doesn't need CSRF token in request
router.get('/count', cartController.getCartCount);

// Protected routes - require CSRF token
router.post('/remove/:itemId', cartController.removeItem);
router.post('/update/:itemId', cartController.updateItemQuantity);
router.post('/add/:productId', cartController.addToCart);

// View routes - use CSRF token in views
router.get('/:id', cartController.showCart);
router.get('/', cartController.showCart);

module.exports = router;