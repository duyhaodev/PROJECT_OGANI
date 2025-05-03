const path = require('path');
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

class CardController {

    // GET /cart
    async showCart(req, res) {
        // 1. Kiểm tra đã login chưa
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const userId = req.session.user._id;

        // 2. Lấy cart, populate thông tin product
        let cart = await Cart.findOne({ userId })
            .populate('items.productId')
            .lean();

        // 3. Chuẩn bị array để render
        const items = (cart && cart.items)
            ? cart.items.map(i => ({
                _id: i.productId._id,
                title: i.productId.title,
                thumbnail: i.productId.thumbnail,
                price: i.productId.price,
                quantity: i.quantity,
                total: i.productId.price * i.quantity
            }))
            : [];

        // 4. Render view, truyền items
        res.render('client/pages/shop-cart', {
            layout: 'main',
            pageTitle: 'Your Cart',
            cartItems: items,
            subtotal: items.reduce((s, x) => s + x.total, 0).toFixed(2)
        });
    }

}

module.exports = new CardController();