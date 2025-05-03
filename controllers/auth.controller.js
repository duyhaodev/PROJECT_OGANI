const User = require("../models/user.model")

class AuthController {
    
    async signup (req, res) {
        try {
            const { emailAddress, fullName, password } = req.body;

            // Tạo username tự động từ emailAddress
            const username = emailAddress.split("@")[0];

            // Kiểm tra nếu email hoặc username đã tồn tại
            const existingUser = await User.findOne({ $or: [{ username }, { emailAddress }] });
            if (existingUser) {
                return res.status(400).json({ message: "Username hoặc Email đã được sử dụng." });
            }

            // Tạo người dùng mới
            const user = new User({
                username,
                emailAddress,
                fullName,
                password
            });

            // Lưu người dùng vào cơ sở dữ liệu
            await user.save();

            res.redirect("/login");
        } catch (error) {
            res.status(500).json({ message: "Lỗi server.", error });
        }
    }

    async login (req, res) {
        try {
            const { emailAddress, password } = req.body;
    
            // Tìm người dùng theo email
            const user = await User.findOne({ emailAddress });
            if (!user) {
                return res.status(400).json({ message: "Email hoặc mật khẩu không đúng." });
            }
    
            // Kiểm tra mật khẩu
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: "Email hoặc mật khẩu không đúng." });
            }
    
            // Lưu thông tin người dùng vào session
            req.session.user = {
                username: user.username,
                fullName: user.fullName,
                emailAddress: user.emailAddress,
                role: user.role
            };

            // Chuyển hướng đến trang chủ
            res.redirect("/waiting");
        } catch (error) {
            res.status(500).json({ message: "Lỗi server.", error });
        }
    }

    async logout(req, res) {
        try {
            // Xóa thông tin người dùng khỏi session
            req.session.destroy((err) => {
                if (err) {
                    console.error("Lỗi khi xóa session:", err);
                    return res.status(500).json({ message: "Lỗi server." });
                }
    
                // Chuyển hướng về trang đăng nhập
                res.redirect("/");
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server.", error });
        }
    }
}

module.exports = new AuthController();