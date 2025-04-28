
class AdminOrderController {
  order (req, res) {
    const user = req.session.user || null;
    res.render("admin/manage_order",{
      pageTitle : "Trang Admin",
      user
    });
  }
}

module.exports = new AdminOrderController();