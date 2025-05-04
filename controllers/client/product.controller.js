const mongoose = require('mongoose');
const { Product, detail } = require("../../models/product.model.js");
const modelCatalog = require("../../models/catalog.model.js");
const Cart = require('../../models/cart.model');

class ProductController {
  // Trang danh sách sản phẩm
  async index(req, res) {
    try {
      const listPro = await Product.find({}).lean();
      const listCat = await modelCatalog.list();
      const user = req.session.user || null;
      res.render("client/pages/home", {
        layout: 'main',
        pageTitle: "Tất cả sản phẩm",
        listPro,
        listCat,
        user,
        breadcrumb: "Tất cả sản phẩm"
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi khi tải danh sách sản phẩm");
    }
  }

  // Tìm kiếm sản phẩm
  async search(req, res) {
    try {
      const keyword = req.query.q || '';
      const regex = new RegExp(keyword, 'i');
      const listPro = await Product.find({ title: regex }).lean();
      const listCat = await modelCatalog.list();
      const user = req.session.user || null;
      res.render('client/partials/header', {
        layout: 'main',
        pageTitle: `Kết quả tìm kiếm cho "${keyword}"`,
        listPro,
        user,
        listCat,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Lỗi khi tìm kiếm sản phẩm');
    }
  }
  // Trang chi tiết sản phẩm
  async show(req, res, next) {
    const id = req.params.id;

    // Kiểm tra tính hợp lệ của ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("ID không hợp lệ");
    }

    try {
      // Tìm sản phẩm theo ID, sử dụng phương thức detail
      const product = await detail(id);
      const listPro = await Product.find({}).lean();

      // Nếu không tìm thấy sản phẩm
      if (!product) {
        return res.status(404).send("Không tìm thấy sản phẩm");
      }
      
      const user = req.session.user || null;
      
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
        cartCount,
        product: product, // Không cần mongooseToObject nếu dùng lean()
      });
    } catch (err) {
      console.error("Lỗi khi hiển thị sản phẩm:", err);
      res.status(500).send("Lỗi khi hiển thị sản phẩm");
    }
  }


}

module.exports = new ProductController();