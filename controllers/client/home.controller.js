const { Product } = require("../../models/product.model.js");
const modelCategory = require("../../models/category.model.js");

module.exports.index = async (req, res) => {
  try {
    const user = req.session.user || null;
    const allProducts = await Product.find({}).lean(); // Lấy tất cả sản phẩm
    const listCat = await modelCategory.list();

    // Lọc các sản phẩm trùng (giữ lại duy nhất mỗi cặp title + import)
    const seen = new Set();
    const listPro = allProducts.filter((p) => {
      const key = `${p.title}-${p.import}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    res.render("client/pages/home", {
      layout: "main",
      pageTitle: "Trang chủ",
      user,
      listPro,
      listCat,
      breadcrumb: "Trang chủ",
      currentPage: "home"
    });
  } catch (err) {
    console.error("Lỗi khi tải trang chủ:", err);
    res.status(500).send("Lỗi server khi tải trang chủ");
  }
  
};
