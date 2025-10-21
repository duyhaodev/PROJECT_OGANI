const path = require('path');
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

class CartController {

    // GET /cart
    async showCart(req, res, next) {
        try {
            // 1. Bảo đảm đã login
            if (!req.session.user) {
                return res.redirect('/login');
            }
            const userId = req.session.user._id;

            console.log('Fetching cart for user:', userId);

            // 2. Lấy cart, populate chỉ lấy đúng các trường cần thiết
            const cart = await Cart
                .findOne({ userId })
                .populate('items.productId', 'title sellPrice thumbnail slug')
                .lean();

            console.log('Cart found:', cart ? 'Yes' : 'No');

            if (!cart || !cart.items || cart.items.length === 0) {
                console.log('Cart is empty');
                return res.render('client/pages/shop-cart', {
                    layout: 'main',
                    pageTitle: "Cart",
                    cartItems: [],
                    subtotal: 0,
                    cartCount: 0,
                    user: req.session.user || null,
                    currentPage: "cart"
                });
            }

            console.log('Cart items count:', cart.items.length);

            // 3. Build lại mảng cartItems 
            const cartItems = cart.items.map(item => {
                console.log('Processing item:', item);
                return {
                    _id: item._id,                            // để xóa theo item._id
                    title: item.productId?.title || '—',
                    sellPrice: item.productId?.sellPrice || 0,
                    thumbnail: item.productId?.thumbnail || '',      // dùng trường thumbnail từ Product
                    slug: item.productId?.slug || '',               // thêm slug để link đến trang chi tiết sản phẩm
                    quantity: item.quantity,
                    total: item.quantity * (item.productId?.sellPrice || 0)
                };
            });

            // 4. Tính toán tổng tiền và VAT
            const subtotal = cartItems.reduce((total, item) => total + item.total, 0);
            const vat = subtotal * 0.1; // 10% VAT
            
            // Miễn phí vận chuyển cho đơn hàng từ 100.000đ
            let shippingFee = 30000; // Phí vận chuyển mặc định
            if (subtotal >= 100000) {
                shippingFee = 0; // Miễn phí vận chuyển
            }
            
            const totalAmount = subtotal + vat + shippingFee;

            // 5. Tính tổng số lượng sản phẩm trong giỏ hàng
            const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

            console.log('Rendering cart with items:', cartItems.length);

            const user = req.session.user || null;
            // 6. Render view với dữ liệu
            res.render('client/pages/shop-cart', {
                layout: 'main',
                pageTitle: "Cart",
                cartItems,
                subtotal,
                cartCount,
                user,
                currentPage: "cart",
            });
        } catch (error) {
            console.error('Error in showCart:', error);
            res.status(500).send('Đã xảy ra lỗi khi hiển thị giỏ hàng');
        }
    }

    // POST /cart/add/:productId
    async addToCart(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }
            const userId = req.session.user._id;
            const prodId = req.params.productId;
            const qty = parseInt(req.body.qty) || 1;

            console.log('Adding to cart:', { userId, prodId, qty });

            // 1. Kiểm tra product tồn tại
            const product = await Product.findById(prodId).lean();
            if (!product) {
                console.log('Product not found');
                return res.status(404).send('Không tìm thấy sản phẩm');
            }

            console.log('Product found:', product.title);

            // 2. Kiểm tra tồn kho - Truy vấn trực tiếp sản phẩm khả dụng từ database
            const availableProducts = await Product.find({
                import: product.import,
                status: { $in: ['IN_STOCK', 'ON_SALE'] },
                active: 'active'
            }).lean();
            
            // Số lượng tồn kho chính là số lượng sản phẩm khả dụng
            const stockCount = availableProducts.length;
            
            console.log(`Tồn kho hiện tại: ${stockCount} sản phẩm với mã import ${product.import}`);
            console.log('Chi tiết sản phẩm khả dụng:');
            availableProducts.forEach((p, index) => {
                console.log(`Sản phẩm khả dụng ${index + 1}: id=${p._id}, status=${p.status}, active=${p.active}`);
            });

            // 3. Kiểm tra số lượng tồn kho
            if (stockCount <= 0) {
                console.log('Product out of stock');
                return res.status(400).json({
                    success: false,
                    message: 'Sản phẩm đã hết hàng'
                });
            }

            // 4. Kiểm tra số lượng đã có trong giỏ hàng
            const existingCart = await Cart.findOne({ userId });
            let currentQtyInCart = 0;
            
            if (existingCart && existingCart.items) {
                // Tìm sản phẩm trong giỏ hàng
                const existingItem = existingCart.items.find(i => i.productId && i.productId.toString() === prodId);
                if (existingItem) {
                    currentQtyInCart = existingItem.quantity;
                }
            }
            
            console.log(`Số lượng hiện có trong giỏ: ${currentQtyInCart}`);
            console.log(`Số lượng yêu cầu thêm: ${qty}`);
            console.log(`Tổng số lượng sau khi thêm: ${currentQtyInCart + qty}`);
            
            // 5. Kiểm tra tổng số lượng (hiện tại + yêu cầu) có vượt quá tồn kho không
            console.log(`So sánh: currentQtyInCart (${currentQtyInCart}) + qty (${qty}) = ${currentQtyInCart + qty} với stockCount = ${stockCount}`);
            
            // Chỉ kiểm tra nếu tổng số lượng vượt quá tồn kho
            if (currentQtyInCart + qty > stockCount) {
                console.log(`Tổng số lượng yêu cầu (${currentQtyInCart + qty}) vượt quá tồn kho (${stockCount})`);
                const remainingStock = stockCount - currentQtyInCart;
                const message = remainingStock > 0 ? 
                    `Chỉ còn ${remainingStock} sản phẩm trong kho có thể thêm vào giỏ hàng` : 
                    `Bạn đã thêm hết số lượng sản phẩm có sẵn vào giỏ hàng`;
                
                return res.status(400).json({
                    success: false,
                    message: message,
                    availableStock: remainingStock
                });
            } else {
                console.log(`Đủ tồn kho để thêm ${qty} sản phẩm vào giỏ hàng`);
            }

            // 6. Sử dụng giỏ hàng đã tìm ở trên hoặc tạo mới nếu chưa có
            let cart;
            if (!existingCart) {
                console.log('Creating new cart');
                cart = new Cart({
                    userId,
                    items: []
                });
            } else {
                console.log('Found existing cart:', existingCart._id);
                cart = existingCart;
            }

            // Đảm bảo items là một mảng
            if (!cart.items) {
                cart.items = [];
            }

            // 7. Thêm sản phẩm vào giỏ hàng
            const existingItemIndex = cart.items.findIndex(i => i.productId && i.productId.toString() === prodId);
            
            console.log(`Kiểm tra sản phẩm trong giỏ hàng: ${existingItemIndex >= 0 ? 'Có' : 'Không'}`);
            
            if (existingItemIndex >= 0) {
                // Nếu sản phẩm đã có trong giỏ hàng, cộng dồn số lượng mới vào số lượng hiện tại
                console.log(`Sản phẩm đã có trong giỏ hàng, số lượng hiện tại: ${cart.items[existingItemIndex].quantity}, số lượng thêm: ${qty}`);
                // Cộng dồn số lượng mới vào số lượng hiện tại
                cart.items[existingItemIndex].quantity += qty;
                console.log(`Tổng số lượng sau khi cộng dồn: ${cart.items[existingItemIndex].quantity}`)
            } else {
                // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
                console.log(`Thêm sản phẩm mới vào giỏ hàng với số lượng: ${qty}`);
                cart.items.push({
                    productId: prodId,
                    quantity: qty
                });
            }

            console.log('Saving cart with items:', cart.items);
            await cart.save();
            console.log('Cart saved successfully');

            // Nếu request là AJAX, trả về JSON response
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.json({ success: true, message: 'Sản phẩm đã được thêm vào giỏ hàng' });
            }

            // Nếu không phải AJAX, redirect như cũ
            res.redirect('/cart');
        } catch (error) {
            console.error('Error in addToCart:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng',
                error: error.message
            });
        }
    }

    // POST /cart/remove/:itemId
    async removeItem(req, res) {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }
            const userId = req.session.user._id;
            const { itemId } = req.params;

            console.log('Removing item from cart:', { userId, itemId });

            const cart = await Cart.findOne({ userId });
            if (cart) {
                cart.items = cart.items.filter(i => !i._id.equals(itemId));
                await cart.save();
                console.log('Item removed successfully');
            } else {
                console.log('Cart not found');
            }
            res.redirect('/cart');
        } catch (error) {
            console.error('Error in removeItem:', error);
            res.status(500).send('Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng');
        }
    }

    // GET /cart/count
    async getCartCount(req, res) {
        try {
            if (!req.session.user) {
                return res.json({ count: 0 });
            }

            const userId = req.session.user._id;
            const cart = await Cart.findOne({ userId }).lean();

            // Tính tổng số lượng sản phẩm trong giỏ hàng
            const count = cart && cart.items ?
                cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

            console.log('Cart count for user', userId, ':', count);
            res.json({ count });
        } catch (error) {
            console.error('Error in getCartCount:', error);
            res.json({ count: 0, error: 'Đã xảy ra lỗi khi lấy số lượng sản phẩm trong giỏ hàng' });
        }
    }

    // POST /cart/update/:itemId
//     async updateItemQuantity(req, res) {
//         try {
//               const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return res.status(400).json({
//                 success: false,
//                 message: 'Validation failed',
//                 errors: errors.array(),
//                 });
//             }
//             if (!req.session.user) {
//                 return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập' });
//             }

//             const userId = req.session.user._id;
//             const { itemId } = req.params;
//             const { quantity } = req.body;

//             // Đảm bảo quantity là số và lớn hơn 0
//             const qty = parseInt(quantity);
//             if (isNaN(qty) || qty < 1) {
//                 return res.status(400).json({ success: false, message: 'Số lượng không hợp lệ' });
//             }

//             console.log('Updating cart item quantity:', { userId, itemId, qty });

//             // Tìm giỏ hàng
//             const cart = await Cart.findOne({ userId });
//             if (!cart) {
//                 return res.status(404).json({ success: false, message: 'Không tìm thấy giỏ hàng' });
//             }

//             // Tìm sản phẩm trong giỏ hàng
//             const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
//             if (itemIndex === -1) {
//                 return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
//             }

//             // Lấy thông tin sản phẩm để kiểm tra tồn kho
//             const product = await Product.findById(cart.items[itemIndex].productId).lean();
//             if (!product) {
//                 return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin sản phẩm' });
//             }

//             // Kiểm tra tồn kho - Truy vấn trực tiếp sản phẩm khả dụng từ database
//             const availableProducts = await Product.find({
//                 import: product.import,
//                 status: { $in: ['IN_STOCK', 'ON_SALE'] },
//                 active: 'active'
//             }).lean();
            
//             // Số lượng tồn kho chính là số lượng sản phẩm khả dụng
//             const stockCount = availableProducts.length;
            
//             console.log(`Tồn kho hiện tại: ${stockCount} sản phẩm với mã import ${product.import}`);
//             console.log('Chi tiết sản phẩm khả dụng:');
//             availableProducts.forEach((p, index) => {
//                 console.log(`Sản phẩm khả dụng ${index + 1}: id=${p._id}, status=${p.status}, active=${p.active}`);
//             });

//             // Kiểm tra số lượng tồn kho
//             if (stockCount <= 0) {
//                 return res.status(400).json({ success: false, message: 'Sản phẩm đã hết hàng' });
//             }

//             // Kiểm tra nếu số lượng yêu cầu vượt quá số lượng tồn kho
//             if (qty > stockCount) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `Chỉ còn ${stockCount} sản phẩm trong kho`,
//                     availableStock: stockCount
//                 });
//             }

//             // Cập nhật số lượng
//             cart.items[itemIndex].quantity = qty;
//             await cart.save();

//             // Tính lại tổng tiền của sản phẩm
//             const total = qty * (product?.sellPrice || 0);

//             // Tính lại tổng tiền của giỏ hàng
//             let subtotal = 0;
//             for (const item of cart.items) {
//                 const prod = await Product.findById(item.productId).lean();
//                 subtotal += item.quantity * (prod?.sellPrice || 0);
//             }

//             // Tính tổng số lượng sản phẩm trong giỏ hàng
//             const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);

//             return res.json({
//                 success: true,
//                 message: 'Cập nhật số lượng thành công',
//                 itemTotal: total,
//                 subtotal: subtotal,
//                 cartCount: cartCount
//             });
//         } catch (error) {
//             console.error('Error in updateItemQuantity:', error);
//             return res.status(500).json({
//                 success: false,
//                 message: 'Đã xảy ra lỗi khi cập nhật số lượng',
//                 error: error.message
//             });
//         }
//     }
// }
// POST /cart/update/:itemId
    async updateItemQuantity(req, res) {
        try {
            // 👉 CHÈN Ở ĐÂY (1) - Kiểm tra validation từ express-validator
            const { validationResult } = require('express-validator');
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array(),
                });
            }

            // 👉 CHÈN Ở ĐÂY (2) - Kiểm tra đăng nhập
            if (!req.session.user) {
                return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập' });
            }

            const userId = req.session.user._id;
            const { itemId } = req.params;
            const { quantity } = req.body;

            // 👉 CHÈN Ở ĐÂY (3) - Kiểm tra ObjectId hợp lệ
            const mongoose = require('mongoose');
            if (!mongoose.Types.ObjectId.isValid(itemId)) {
                return res.status(400).json({ success: false, message: 'Mã sản phẩm không hợp lệ' });
            }

            // 👉 CHÈN Ở ĐÂY (4) - Kiểm tra và giới hạn số lượng
            const qty = parseInt(quantity);
            if (isNaN(qty) || qty < 1 || qty > 100) {
                return res.status(400).json({ success: false, message: 'Số lượng không hợp lệ (1 - 100)' });
            }

            console.log('Updating cart item quantity:', { userId, itemId, qty });

            // 👉 CHÈN Ở ĐÂY (5) - Tìm giỏ hàng của user
            const cart = await Cart.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy giỏ hàng' });
            }

            // 👉 CHÈN Ở ĐÂY (6) - Tìm item trong giỏ
            const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
            if (itemIndex === -1) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
            }

            // 👉 CHÈN Ở ĐÂY (7) - Kiểm tra tồn kho
            const product = await Product.findById(cart.items[itemIndex].productId).lean();
            if (!product) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin sản phẩm' });
            }

            const availableProducts = await Product.find({
                import: product.import,
                status: { $in: ['IN_STOCK', 'ON_SALE'] },
                active: 'active'
            }).lean();

            const stockCount = availableProducts.length;

            console.log(`Tồn kho hiện tại: ${stockCount} sản phẩm với mã import ${product.import}`);

            if (stockCount <= 0) {
                return res.status(400).json({ success: false, message: 'Sản phẩm đã hết hàng' });
            }

            if (qty > stockCount) {
                return res.status(400).json({
                    success: false,
                    message: `Chỉ còn ${stockCount} sản phẩm trong kho`,
                    availableStock: stockCount
                });
            }

            // 👉 CHÈN Ở ĐÂY (8) - Cập nhật giỏ hàng
            cart.items[itemIndex].quantity = qty;
            await cart.save();

            // 👉 CHÈN Ở ĐÂY (9) - Tính lại tổng tiền
            const total = qty * (product?.sellPrice || 0);

            let subtotal = 0;
            for (const item of cart.items) {
                const prod = await Product.findById(item.productId).lean();
                subtotal += item.quantity * (prod?.sellPrice || 0);
            }

            const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);

            return res.json({
                success: true,
                message: 'Cập nhật số lượng thành công',
                itemTotal: total,
                subtotal: subtotal,
                cartCount: cartCount
            });
        } catch (error) {
            console.error('Error in updateItemQuantity:', error);
            return res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi cập nhật số lượng',
                error: error.message
            });
        }
    }
}


module.exports = new CartController();