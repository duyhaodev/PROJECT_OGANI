const Product = require ("../../models/product.model.js")

class AdminCateController {
  category (req, res) {
    res.render("admin/manage_category",{
      pageTitle : "Trang Admin",
    });
  }
}

module.exports = new AdminCateController();