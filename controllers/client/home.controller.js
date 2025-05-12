const Product = require("../../models/product.model");
const Category = require("../../models/category.model");

module.exports.index = async (req, res) => {
  try {
    const user = req.session.user || null;
    const page = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định là 1)
    const limit = 12; // Số sản phẩm mỗi trang
    const skip = (page - 1) * limit; // Số sản phẩm cần bỏ qua

    // Lấy tất cả sản phẩm từ database
    const allProducts = await Product.find({ active: "active" }).lean();

    // Loại bỏ sản phẩm trùng theo cặp 'title' và 'import'
    const seen = new Set();
    const uniqueProducts = allProducts.filter(product => {
      const key = `${product.title}-${product.import}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Tổng số sản phẩm duy nhất
    const totalProducts = uniqueProducts.length;

    // Phân trang trên danh sách sản phẩm duy nhất
    const paginatedProducts = uniqueProducts.slice(skip, skip + limit);

    // Tổng số trang
    const totalPages = Math.ceil(totalProducts / limit);

    // Lấy danh sách tất cả danh mục có trạng thái 'active'
    const listCat = await Category.find({ status: "active" }).lean();

    // Render trang chủ
    res.render("client/pages/home", {
      layout: "main",
      pageTitle: "Trang chủ",
      user,
      listPro: paginatedProducts, // Sử dụng danh sách sản phẩm đã được lọc và phân trang
      listCat,
      breadcrumb: "Trang chủ",
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("❌ Lỗi khi tải trang chủ:", error);
    res.status(500).send("Lỗi server khi tải trang chủ");
  }
};