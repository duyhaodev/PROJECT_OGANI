const Product = require ("../../models/product.model.js")


class AdminCateController {

  category (req, res) {
    const user = req.session.user || null;
    res.render("admin/manage_category",{
      pageTitle : "Trang Admin",
      user
    });
  }
}

module.exports = new AdminCateController();