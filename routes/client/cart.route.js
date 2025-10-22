const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/client/cart.controller')
const { csrfProtection, csrfToken } = require('../../middleware/csrf2.middleware');
const { body, param } = require('express-validator');


router.get('/count', csrfProtection, csrfToken, cartController.getCartCount);

router.post('/remove/:itemId', csrfProtection, csrfToken, cartController.removeItem);

router.post(
  '/update/:itemId',
  [
    param('itemId').isMongoId().withMessage('Invalid itemId format'),
    body('quantity')
      .isInt({ min: 1, max: 100 })
      .withMessage('Quantity must be an integer between 1 and 100'),
  ],
  csrfProtection,
  csrfToken,
  cartController.updateItemQuantity
);
router.post('/add/:productId', cartController.addToCart);

router.get('/:id', csrfProtection, csrfToken, cartController.showCart);

router.get('/', csrfProtection, csrfToken, cartController.showCart);

module.exports = router;