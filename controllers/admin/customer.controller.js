const User = require("../../models/user.model");

class AdminCustomerController {
  async customer(req, res) {
    try {
        const user = req.session.user || null;

        // Lấy danh sách người dùng có role = 1
        const customers = await User.find({ role: 1 }); // Sử dụng await để lấy dữ liệu thực tế
        console.log("Danh sách người dùng", customers);

        // Render view và truyền dữ liệu
        res.render("admin/manage_customer", {
            pageTitle: "Trang Admin",
            user,
            customers,
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        res.status(500).json({ message: "Lỗi server.", error });
    }
}
  }
  
  module.exports = new AdminCustomerController();