const Product = require ("../../models/product.model.js")

class AdminProductController {
  index (req, res) {
    res.render("home",{
      pageTitle : "Trang Admin",
  });
  }
}

module.exports = new AdminProductController();