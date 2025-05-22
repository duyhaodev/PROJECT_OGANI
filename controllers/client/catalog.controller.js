const Category = require('../../models/category.model.js');
const Product = require('../../models/product.model.js');

// =============================
// Các hàm tiện ích
// =============================

// Lọc các sản phẩm duy nhất (không trùng lặp)
const getUniqueProducts = (products) => {
  const seen = new Set();
  return products.filter(item => {
    const key = `${item.title}-${item.import}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// =============================
// Controller
// =============================

class CatalogController {
  // Hiển thị danh sách tất cả danh mục sản phẩm
  async index(req, res) {
    try {
      const user = req.session.user || null;
      const catalogList = res.locals.catalogList; // Lấy danh sách danh mục từ middleware;
      res.render("client/pages/shop-grid", {
        layout: "main",
        pageTitle: "Danh mục sản phẩm",
        catalogList,
        user,
        currentPage: "catalog"
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  // Hiển thị sản phẩm theo danh mục
  async show(req, res) {
    const categorySlug = req.params.slug;
    const user = req.session.user || null;

    try {
      const catalogList = res.locals.catalogList;
      const catalog = catalogList.find(cat => cat.slug === categorySlug);

      if (!catalog) {
        return res.status(404).render('client/pages/404', {
          layout: "main",
          message: 'Danh mục không tồn tại',
          user,
          catalogList,
        });
      }

      // Phân trang
      const page = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định là 1)
      const limit = 12; // Số sản phẩm mỗi trang
      const skip = (page - 1) * limit; // Số sản phẩm cần bỏ qua

      // Lấy tất cả sản phẩm theo categoryId
      const allProducts = await Product.find({ categoryId: catalog._id, active: "active" }).lean();

      // Lọc các sản phẩm duy nhất
      const uniqueProducts = getUniqueProducts(allProducts);

      // Tổng số sản phẩm duy nhất
      const totalProducts = uniqueProducts.length;

      // Phân trang trên danh sách sản phẩm duy nhất
      const paginatedProducts = uniqueProducts.slice(skip, skip + limit);

      // Tổng số trang
      const totalPages = Math.ceil(totalProducts / limit);

      res.render('client/pages/shop-grid', {
        layout: "main",
        pageTitle: catalog.categoryName,
        products: paginatedProducts, // Sử dụng danh sách sản phẩm đã được lọc và phân trang
        categorySlug,
        user,
        catalogList,
        currentPage: page,
        totalPages,
      });
    } catch (err) {
      console.error('Lỗi khi load sản phẩm theo danh mục:', err);
      res.status(500).send('Lỗi server');
    }
  }
}

module.exports = new CatalogController();
