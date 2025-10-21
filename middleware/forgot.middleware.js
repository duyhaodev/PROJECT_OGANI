module.exports = {
    checkOTPSession: (req, res, next) => {
        // Kiểm tra nếu có email trong session (đã gửi OTP)
        if (!req.session.emailAddress || !req.session.otp) {
            return res.redirect("/login");
        }
        next();
    },

    checkResetPasswordSession: (req, res, next) => {
        // Kiểm tra nếu có email trong session (đã xác minh OTP thành công)
        if (!req.session.emailAddress) {
            return res.redirect("/login");
        }
        next();
    }
};