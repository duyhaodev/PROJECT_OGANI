
class AdminCustomerController {
    customer (req, res) {
      res.render("admin/manage_customer",{
        pageTitle : "Trang Admin",
      });
    }
  }
  
  module.exports = new AdminCustomerController();