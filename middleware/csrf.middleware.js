const csrf = require('csurf');
module.exports = csrf({ cookie: true }); // 1 instance dùng chung
