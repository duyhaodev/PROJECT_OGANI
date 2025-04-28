
class AdminStaffController {
    staff (req, res) {
      res.render("admin/manage_staff",{
        pageTitle : "Trang Admin",
      });
    }
  }
  
  module.exports = new AdminStaffController();