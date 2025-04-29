const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({


});

const Cart = mongoose.model('Cart', cartSchema, 'cart')

module.exports = Cart;