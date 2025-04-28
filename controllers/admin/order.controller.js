
class AdminOrderController {
  order (req, res) {
    res.render("admin/manage_order",{
      pageTitle : "Trang Admin",
    });
  }
}

module.exports = new AdminOrderController();