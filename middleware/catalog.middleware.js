const Category = require('../models/category.model'); // import đúng model Category

const loadCatalogList = async (req, res, next) => {
  try {
    const catalogList = await Category.find({ status: 'active' }).lean();
    res.locals.catalogList = catalogList; // gán cho biến global của view
    console.log("📦 Danh mục lấy từ DB:", catalogList);
    next(); // gọi middleware tiếp theo
  } catch (error) {
    console.error("Lỗi khi tải danh sách danh mục:", error);
    res.locals.catalogList = []; // gán mảng rỗng để tránh lỗi view
    next();
  }
};

module.exports = loadCatalogList;
