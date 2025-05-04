const modelCatalog = require('../../models/catalog.model.js');
const modelProduct = require('../../models/product.model.js');

class CatalogController {
  async index(req, res) {
    try {
      const catalogList = await modelCatalog.list(); // Sửa ở đây
      res.render("client/pages/shop-grid", {
        layout: "main",
        pageTitle: "Danh mục sản phẩm",
        catalogList
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  async show(req, res) {
    try {
      const { name } = req.params;
      const catalog = await modelCatalog.listByName(name); // Sửa ở đây
      res.render("client/pages/product-details", {
        layout: "main",
        pageTitle: `Chi tiết sản phẩm: ${name}`,
        catalog
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
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
