const path = require('path');

class InfoController {
    showInfo(req, res) {
        const user = req.session.user || null; // Lấy thông tin người dùng từ session
        res.render("client/pages/home", {

        });
    }
}

module.exports = new InfoController();