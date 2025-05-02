const User = require("../../models/user.model");

class AdminCustomerController {
  async customer(req, res) {
    try {
      const user = req.session.user || null;
      const customers = await User.find({ role: 1 }).lean(); 
      console.log("Danh sách khách hàng:", customers); 

      const modifiedCustomers = customers.map(c => ({
        ...c,
        isActive: c.status === "active"
      }));

      res.render("admin/manage_customer", {
        pageTitle: "Customer Management",
        user,
        modifiedCustomers,
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách khách hàng:', error);
      res.send('Đã xảy ra lỗi khi lấy danh sách khách hàng');
    }
  }


  async lockCustomer(req, res) {
    try {
      const customerId = req.params.id;
      await User.findByIdAndUpdate(customerId, { status: "locked" });
      console.log(`Đã khóa tài khoản: ${customerId}`);
      res.redirect("/admin/customer");
    } catch (error) {
      console.error('Lỗi khóa tài khoản:', error);
      res.send('Đã xảy ra lỗi khi khóa tài khoản');
    }
  }


  async unlockCustomer(req, res) {
    try {
      const customerId = req.params.id;
      await User.findByIdAndUpdate(customerId, { status: "active" });
      console.log(`Đã mở khóa tài khoản: ${customerId}`);
      res.redirect("/admin/customer");
    } catch (error) {
      console.error('Lỗi mở khóa tài khoản:', error);
      res.send('Đã xảy ra lỗi khi mở khóa tài khoản');
    }
  }

  async viewCustomer(req, res) {
    try {
      const user = req.session.user || null;
      const customerId = req.params.id;
      const customer = await User.findById(customerId).lean();
  
      if (!customer || customer.role !== 1) {
        return res.status(404).send("Không tìm thấy khách hàng.");
      }
  
      const formattedDOB = customer.dateOfBirth
        ? new Date(customer.dateOfBirth).toISOString().split("T")[0]
        : "";
      const formattedJoinAt = new Date(customer.joinAt).toLocaleDateString("vi-VN");
  
      res.render("admin/customer_view", {
        user,
        customer,
        formattedDOB,
        formattedJoinAt,
        isActive: customer.status === "active",
      });
    } catch (err) {
      console.error("Lỗi xem chi tiết khách hàng:", err);
      res.status(500).send("Lỗi khi xem chi tiết khách hàng.");
    }
  }  
}

module.exports = new AdminCustomerController();
