const mongoose = require('mongoose');
const { Product, findByName } = require("../../models/product.model.js");
const Cart = require('../../models/cart.model');

class ProductController {
  // Tìm kiếm sản phẩm
  async searchProduct(req, res) {
    const keyword = req.query.q || "";
    try {
      const result = await findByName(keyword);

      // Lọc trùng theo title + import
      const seen = new Set();
      const uniqueProducts = result.filter(item => {
        const key = `${item.title}-${item.import}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      res.json(uniqueProducts.map(item => ({
        title: item.title,
        id: item._id
      })));
    } catch (err) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", err);
      res.status(500).json({ error: "Lỗi tìm kiếm" });
    }
  }

  // Trang chi tiết sản phẩm
  async show(req, res, next) {
    const slug = req.params.slug;

    try {
      // Tìm sản phẩm theo ID, sử dụng phương thức lean để chuyển đổi Mongoose object thành plain object
      const product = await Product.findOne({ slug }).lean();
      const allProducts = await Product.find({}).lean();
      // Lọc các sản phẩm trùng (giữ lại duy nhất mỗi cặp title + import)
      const seen = new Set();
      const listPro = allProducts.filter((p) => {
        const key = `${p.title}-${p.import}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      const user = req.session.user || null;
      // Nếu không tìm thấy sản phẩm
      if (!product) {
        return res.status(404).send("Không tìm thấy sản phẩm");
      }
      // Tính tồn kho (đếm số lượng sản phẩm cùng import và status: active)
      const stockCount = await Product.countDocuments({
        import: product.import,
        status: 'active'
      });
      product.stock = stockCount;
      // Lấy số lượng sản phẩm trong giỏ hàng nếu đã đăng nhập
      let cartCount = 0;
      if (user) {
        const cart = await Cart.findOne({ userId: user._id }).lean() || { items: [] };
        cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);
      }

      // Hiển thị chi tiết sản phẩm
      res.render('client/pages/product-details', {
        layout: 'main',
        pageTitle: "Product details",
        listPro,
        user,
        product: product,
        cartCount,
      });
    } catch (err) {
      console.error("Lỗi khi hiển thị sản phẩm:", err);
      res.status(500).send("Lỗi khi hiển thị sản phẩm");
    }
  }

}

module.exports = new ProductController();