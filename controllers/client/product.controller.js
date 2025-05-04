
const mongoose = require('mongoose');  
const { Product } = require("../../models/product.model.js");
const modelCatalog = require("../../models/catalog.model.js");

class ProductController {
  

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
    // Tìm sản phẩm theo ID, sử dụng phương thức lean để chuyển đổi Mongoose object thành plain object
    const product = await Product.findById(id).lean();
    const listPro = await Product.find({}).lean();
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
    // Hiển thị chi tiết sản phẩm
    res.render('client/pages/product-details', {
      layout: 'main',
      pageTitle : "Product details",
      listPro,
      user,
      product: product , 
    });
  } catch (err) {
    console.error("Lỗi khi hiển thị sản phẩm:", err);
    res.status(500).send("Lỗi khi hiển thị sản phẩm");
  }
}

    
}

module.exports = new ProductController();
