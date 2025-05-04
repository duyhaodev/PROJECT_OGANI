const modelCatalog = require('../../models/catalog.model.js');
const modelProduct = require('../../models/product.model.js');


class CatalogController {
  async index(req, res) {
    try {
      const user = req.session.user || null;
      const catalogList = await modelCatalog.list(); // Sửa ở đây
      res.render("client/pages/shop-grid", {
        layout: "main",
        pageTitle: "Danh mục sản phẩm",
        catalogList,
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  async show(req, res) {
    const nameCat = req.params.nameCat;
    const user = req.session.user || null;
  
    try {
      // ✅ Lấy catalogList từ DB thay vì từ res.locals
      const catalogList = await modelCatalog.list();
      const catalog = catalogList.find(cat => cat.nameCat === nameCat);
  
      if (!catalog) {
        return res.status(404).render('client/pages/404', {
          layout: "main",
          message: 'Danh mục không tồn tại',
          user,
          catalogList
        });
      }
  
      const products = await modelProduct.find({ categoryId: catalog._id })
  
      res.render('client/pages/shop-grid', {
        layout: "main",
        pageTitle: `${nameCat}`,
        products,
        categoryName: nameCat,
        user,
        catalogList // Truyền vào view để render sidebar
      });
    } catch (err) {
      console.error('Lỗi khi load sản phẩm theo danh mục:', err);
      res.status(500).send('Lỗi server');
    }
  }
  
  

  async getAll(req, res) {
    try {
      const catalogs = await modelCatalog.list();
      res.json(catalogs);
    } catch (error) {
      console.error("Error fetching catalogs:", error);
      res.status(500).json({ message: "Server Error" });
    }
  }
}

module.exports = new CatalogController();
