const path = require('path');
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

class CartController {

    // GET /cart
    async showCart(req, res, next) {
        // 1. Bảo đảm đã login
        if (!req.session.user) {
            return res.redirect('/login');
        }
        const userId = req.session.user._id;

        // 2. Lấy cart, populate chỉ lấy đúng các trường cần thiết
        const cart = await Cart
            .findOne({ userId })
            .populate('items.productId', 'title sellPrice thumbnail')
            .lean()
            || { items: [] };

        // 3. Build lại mảng cartItems 
        const cartItems = cart.items.map(item => ({
            _id: item._id,                            // để xóa theo item._id
            title: item.productId?.title || '—',
            sellPrice: item.productId?.sellPrice || 0,
            thumbnail: item.productId?.thumbnail || '',      // dùng trường thumbnail từ Product
            quantity: item.quantity,
            total: item.quantity * (item.productId?.sellPrice || 0)
        }));

        // 4. Tính subtotal
        const subtotal = cartItems.reduce((sum, i) => sum + i.total, 0);

        const user = req.session.user || null;
        // 5. Render view với dữ liệu
        res.render('client/pages/shop-cart', {
            layout: 'main',
            pageTitle: "Cart",
            cartItems, subtotal,
            user,
        });
    }

    // POST /cart/add/:productId
    async addToCart(req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        const userId = req.session.user._id;
        const prodId = req.params.productId;
        const qty = parseInt(req.body.qty) || 1;

        // 1. Kiểm tra product tồn tại
        const product = await Product.findById(prodId).lean();
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // 2. Lấy hoặc khởi tạo cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // 3. Nếu đã có item thì tăng quantity, ngược lại push mới
        const idx = cart.items.findIndex(i => i.productId.equals(prodId));
        if (idx > -1) {
            cart.items[idx].quantity += qty;
        } else {
            cart.items.push({ productId: product._id, quantity: qty });
        }

        await cart.save();
        res.redirect('/cart');
    }

    // GET /cart/remove/:itemId
    async removeItem(req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        const userId = req.session.user._id;
        const { itemId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = cart.items.filter(i => !i._id.equals(itemId));
            await cart.save();
        }
        res.redirect('/cart');
    }
}

module.exports = new CartController();