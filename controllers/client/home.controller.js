const path = require('path');

class HomeController {
    index(req, res) {
        const user = req.session.user || null; // Lấy thông tin người dùng từ session
        res.render("client/pages/home", {
            layout: "main",
            pageTitle: "Trang chủ",
            user, // Truyền thông tin người dùng đến view
        });
    }
}

module.exports = new HomeController();