const express = require('express');
const router = express.Router();
const infoController = require('../../controllers/client/info.controller');

// Route hiển thị thông tin người dùng
router.get('/', infoController.showInfo);

// Route cập nhật thông tin người dùng
router.post('/update', infoController.updateInfo);

// Route đổi mật khẩu
router.post('/change-password', infoController.changePassword);

module.exports = router;