const modelCatalog = require('../models/catalog.model');

const loadCatalogList = async (req, res, next) => {
  try {
    const catalogList = await modelCatalog.list();
    res.locals.catalogList = catalogList; // Biến toàn cục cho mọi view
    next();
  } catch (error) {
    console.error("Lỗi khi tải danh sách danh mục:", error);
    res.locals.catalogList = []; // Gán rỗng nếu lỗi để tránh vỡ view
    next();
  }
};

module.exports = loadCatalogList;
