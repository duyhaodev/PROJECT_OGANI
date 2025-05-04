const { Product } = require("../../models/product.model.js");
const modelCatalog = require("../../models/catalog.model.js");

module.exports.index = async (req, res) => {
  try {
    const user = req.session.user || null; // Lấy thông tin người dùng
    const listPro = await Product.find({}).lean(); // Lấy tất cả sản phẩm
    const listCat = await modelCatalog.list(); // Lấy danh sách danh mục

    res.render("client/pages/home", {
      layout: "main",
      pageTitle: "Trang chủ",
      user,
      listPro,
      listCat,
      breadcrumb: "Trang chủ"
    });
  } catch (err) {
    console.error("Lỗi khi tải trang chủ:", err);
    res.status(500).send("Lỗi server khi tải trang chủ");
  }
};
