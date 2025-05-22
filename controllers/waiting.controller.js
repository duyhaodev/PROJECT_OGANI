module.exports.waiting = (req, res) => {
    const user = req.session.user;

    // Kiểm tra nếu không có thông tin người dùng trong session
    if (!user) {
        return res.redirect("/login"); // Chuyển hướng về trang login nếu chưa đăng nhập
    }

    // Phân loại người dùng dựa trên role
    if (user.role === 1) {
        return res.redirect("/"); // Chuyển hướng đến trang chủ cho User
    } else if (user.role === 3) {
        return res.redirect("/admin"); // Chuyển hướng đến trang admin cho Staff và Manager
    } else if (user.role === 2){
        return res.redirect("/staff")
    }

    // Nếu role không hợp lệ, chuyển hướng về trang login
    return res.redirect("/login");
};