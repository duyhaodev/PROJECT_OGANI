const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/user.model");
const validator = require('validator');

class ForgotController {
    generateAndSendOTP = async (emailAddress, req) => {
        const otp = crypto.randomInt(100000, 999999).toString();

        req.session.otp = otp;
        req.session.emailAddress = emailAddress;
        req.session.otpAttempts = 0;

        // Gửi email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_APP_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: emailAddress,
            subject: "Mã OTP để khôi phục mật khẩu",
            text: `Mã OTP của bạn là: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
    }

    sendOTP = async (req, res) => {
        try {
            const raw = req.body?.emailAddress;
            const emailAddress = typeof raw === 'string' ? raw.trim().toLowerCase() : '';

            // Nội dung chung chung
            const neutralMsg = "Mã OTP đã được gửi tới email của bạn";

            // Validate email. Nếu invalid: vẫn trả message & redirect /login
            if (!validator.isEmail(emailAddress)) {
                req.session.message = neutralMsg;
                req.session.isSuccess = true;
                res.redirect("/login");
            }

            const user = await User.findOne({ emailAddress });
            if (user){
                await this.generateAndSendOTP(emailAddress, req);
            }

            req.session.message = neutralMsg;
            req.session.isSuccess = true;
            res.redirect("/verifyOTP");
        } catch (error) {
            console.log(error);
            req.session.message = "Có lỗi xảy ra khi gửi OTP";
            req.session.isSuccess = false;
            res.redirect("/login");
        }
    }

    verifyOTP = async (req, res) => {
        try {
            const { otp } = req.body;

            // Khởi tạo số lần thử nếu chưa có
            if (!req.session.otpAttempts) {
                req.session.otpAttempts = 0;
            }

            // Kiểm tra mã OTP
            if (req.session.otp !== otp) {
                req.session.otpAttempts += 1;

                // Kiểm tra nếu đã vượt quá 5 lần
                if (req.session.otpAttempts >= 5) {
                    // Gửi mã OTP mới
                    await this.generateAndSendOTP(req.session.emailAddress, req);

                    return res.render("verifyOTP", {
                        message: "Quá số lần nhập mã OTP, mời bạn nhận lại mã mới. Mã OTP mới đã được gửi tới email của bạn.",
                        isSuccess: false
                    });
                }

                return res.render("verifyOTP", {
                    message: `Mã OTP không chính xác. Bạn còn ${5 - req.session.otpAttempts} lần thử.`,
                    isSuccess: false
                });
            }

            // Xóa mã OTP khỏi session sau khi xác minh thành công
            req.session.otp = null;
            req.session.otpAttempts = null;

            req.session.message = "Mã OTP chính xác. Bạn có thể đặt lại mật khẩu.";
            res.redirect("/resetPassword");

        } catch (error) {
            console.error("Lỗi khi xác minh OTP:", error);
            res.status(500).json({ message: "Lỗi server.", error });
        }
        
    }

    showResetForm = async (req, res) => {
        try {
            const token = req.query.token;
            if (!token || typeof token !== 'string') {
                return res.render("verifyOTP", { message: "Liên kết không hợp lệ.", isSuccess: false });
            }

            const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
            const user = await User.findOne({
                resetTokenHash: tokenHash,
                resetTokenExpiresAt: { $gt: Date.now() }
            });

            if (!user) {
                return res.render("verifyOTP", { message: "Liên kết hết hạn hoặc không hợp lệ.", isSuccess: false });
            }

            return res.render("verifyOTP", { token, message: null, isSuccess: true });
        } catch (err) {
            console.error("Lỗi hiển thị form reset:", err);
            return res.render("verifyOTP", { message: "Có lỗi xảy ra.", isSuccess: false });
        }
    }
    
    resetPasswordByToken = async (req, res) => {
        try {
            const { token, newPassword, confirmPassword } = req.body;

            if (typeof token !== 'string' || !token) {
                return res.render("resetPassword", { message: "Yêu cầu không hợp lệ.", isSuccess: false });
            }

            if (!newPassword || newPassword !== confirmPassword || newPassword.length < 8) {
                return res.render("resetPassword", { message: "Mật khẩu không hợp lệ.", isSuccess: false });
            }

            const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
            const user = await User.findOne({
                resetTokenHash: tokenHash,
                resetTokenExpiresAt: { $gt: Date.now() }
            });

            if (!user) {
                console.log(user);
                return res.render("resetPassword", { message: "Liên kết đã hết hạn hoặc không hợp lệ.", isSuccess: false });
            }

            user.password = newPassword;

            // Xóa token và otp
            user.resetTokenHash = undefined;
            user.resetTokenExpiresAt = undefined;
            user.resetOtpHash = undefined;
            user.resetOtpExpiresAt = undefined;
            user.resetAttempts = 0;

            await user.save();

            req.session.message = "Mật khẩu đã được đặt lại thành công.";
            req.session.isSuccess = true;
            return res.redirect("/login");
        } catch (err) {
            return res.render("resetPassword", { message: "Có lỗi xảy ra, vui lòng thử lại.", isSuccess: false });
        }
    }

    resetPassword = async (req, res) => {
        try {
            const { newPassword, confirmPassword } = req.body;

            // Kiểm tra xem email có trong session không
            const emailAddress = req.session.emailAddress;
            if (!emailAddress) {
                return res.render("resetPassword", { 
                    message: "Yêu cầu đặt lại mật khẩu không hợp lệ.", 
                    isSuccess: false 
                });

            }

            if (newPassword !== confirmPassword) {
                return res.render("resetPassword", { 
                    message: "Mật khẩu và xác nhận mật khẩu không khớp.", 
                    isSuccess: false 
                });
            }

            if (newPassword.length < 8) {
                return res.render("resetPassword", {
                    message: "Mật khẩu phải có ít nhất 8 ký tự.", 
                    isSuccess: false });
            }

            // Cập nhật mật khẩu mới
            const user = await User.findOne({ emailAddress });
            user.password = newPassword; // Mã hóa mật khẩu nếu cần
            await user.save();

            // Xóa email khỏi session sau khi đặt lại mật khẩu thành công
            req.session.emailAddress = null;
            req.session.otp = null;
            req.session.otpAttempts = null;

            req.session.message = "Mật khẩu đã được đặt lại thành công.";
            req.session.isSuccess = true;
            res.redirect("/login");

        } catch (error) {
            console.error("Lỗi khi đặt lại mật khẩu:", error);
            res.status(500).json({ message: "Lỗi server.", error });
        }
    }
}

module.exports = new ForgotController();