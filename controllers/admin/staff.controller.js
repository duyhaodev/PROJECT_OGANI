
class AdminStaffController {
    staff (req, res) {
      const user = req.session.user || null;
      res.render("admin/manage_staff",{
        pageTitle : "Trang Admin",
        user
      });
    }
  }
  
  module.exports = new AdminStaffController();