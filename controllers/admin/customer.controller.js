
class AdminCustomerController {
    customer (req, res) {
      const user = req.session.user || null;
      res.render("admin/manage_customer",{
        pageTitle : "Trang Admin",
        user
      });
    }
  }
  
  module.exports = new AdminCustomerController();