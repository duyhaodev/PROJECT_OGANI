const User = require("../models/user.model")

class AuthController {
    async signup (req, res) {
        try {
            const { username, password, fullName, emailAddress, gender, phoneNumber, address } = req.body;

            // Kiểm tra nếu email hoặc username đã tồn tại
            const existingUser = await User.findOne({ $or: [{ username }, { emailAddress }] });
            if (existingUser) {
                return res.status(400).json({ message: "Username hoặc Email đã được sử dụng." });
            }

            // Tạo người dùng mới
            const user = new User({
                username,
                password,
                fullName,
                emailAddress,
                gender,
                phoneNumber,
                address,
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
    
            // Đăng nhập thành công, render trang home
            res.render("client/pages/home", {
                layout: 'main',
                pageTitle: "Trang chủ",
                user: {
                    username: user.username,
                    fullName: user.fullName,
                    emailAddress: user.emailAddress,
                },
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server.", error });
        }
    }
}