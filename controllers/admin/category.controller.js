const Category = require("../../models/category.model");
class AdminCateController {
  async category(req, res) {
    try {
      const user = req.session.user || null;
      const categories = await Category.find().lean();
      console.log("Danh sách danh mục:", categories);

      res.render("admin/manage_category", {
        pageTitle: "Category Management",
        user,
        categories
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách danh mục:", error);
      res.send("Đã xảy ra lỗi khi lấy danh sách danh mục");
    }
  }

  async addForm(req, res) {
    try {
      const user = req.session.user || null;

      res.render("admin/category_add", {
        pageTitle: "Thêm danh mục",
        user
      });
    } catch (error) {
      console.error("Lỗi hiển thị form thêm danh mục:", error);
      res.status(500).send("Đã xảy ra lỗi khi hiển thị form thêm danh mục.");
    }
  }

  async addSave(req, res) {
    try {
      const { categoryName, status } = req.body;
      const existing = await Category.findOne({ categoryName });
      if (existing) {
        return res.render("admin/category_add", {
          user: req.session.user,
          errorMessage: "Tên danh mục đã tồn tại!",
          categoryName,
          status,
        });
      }
      const newCategory = new Category({ categoryName, status });
      await newCategory.save();
      res.redirect("/admin/category");
    } catch (err) {
      console.error("Lỗi khi thêm danh mục:", err);
      res.status(500).send("Đã xảy ra lỗi khi thêm danh mục mới.");
    }
  }

  
  async delete(req, res) {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.redirect("/admin/category");
    } catch (err) {
      console.error("Lỗi khi xóa tài khoản:", err);
      res.send("Đã xảy ra lỗi khi xóa tài khoản.");
    }
  }
}

module.exports = new AdminCateController();