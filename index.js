const path = require('path');
const express = require('express');
const session = require('express-session');
const moment = require('moment');
const Swal = require('sweetalert2')
const catalogRouter = require('./routes/client/catalog.route');
require('dotenv').config(); //nhúng env
const Cart = require('./models/cart.model');
const database = require("./config/database.js");
const app = express();
const hbs = require('express-handlebars');
const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const routeStaff = require("./routes/staff/index.route")
const authRoute = require("./routes/auth.route");
const waitingRoute = require("./routes/waiting.route");
const forgotRoute = require("./routes/forgot.route");
const systemConfig = require("./config/system.js")
const loadCatalogList = require('./middleware/catalog.middleware.js');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const https = require('https');
const mongoSanitize = require('express-mongo-sanitize');

app.use(mongoSanitize());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(loadCatalogList);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// DÙNG cookie-parser để csurf có thể đặt token vào cookie.
app.use(cookieParser());// Cho phép csurf lưu secret/token trong cookie

app.use(cookieParser());

app.use(session({
  // Dùng ENV để tránh lộ secret trong code
  secret: process.env.SESSION_SECRET || "dev_secret_change_me",
  resave: false,
  // Không tạo session khi chưa cần (giảm rủi ro & rác)
  saveUninitialized: false,
  cookie: {
    httpOnly: true,                             // chặn JS đọc cookie (giảm XSS)
    secure: process.env.NODE_ENV === 'production', // chỉ gửi qua HTTPS khi chạy production
    sameSite: 'lax',                            // giảm CSRF qua cross-site
    maxAge: 7 * 24 * 60 * 60 * 1000            // 7 ngày 
  }
}));

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'src/resources/views'));


//Template engine
app.engine('hbs', hbs.engine({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'src/resources/views/client/layouts'),
  partialsDir: path.join(__dirname, 'src/resources/views/client/partials'),
  defaultLayout: false,
  helpers: {
    eq: (a, b) => a === b,
    notEq: (a, b) => a !== b,
    formatCurrency: (number) => {
      if (!number) return '0';
      return number.toLocaleString("vi-VN") + 'đ';
    },
    multiply: (a, b) => a * b,
    formatDate: (date, format) => {
      const safeFormat = typeof format === 'string' ? format : 'DD/MM/YYYY';
      return moment(date).format(safeFormat);
    },
    range: (start, end) => {
      const range = [];
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      return range;
    },
    isActive: (page, currentPage) => (page === currentPage ? 'active' : ''),
  },
}));


// Middleware tính cartCount
app.use(async (req, res, next) => {
  try {
    if (req.session.user) {
      // Tìm giỏ hàng của user hiện tại
      const cart = await Cart.findOne({ userId: req.session.user._id }).lean();

      // Nếu có cart, tính tổng quantity; nếu không có, set về 0
      res.locals.cartCount = cart
        ? cart.items.reduce((sum, item) => sum + item.quantity, 0)
        : 0;
    } else {
      // Chưa login => không có item
      res.locals.cartCount = 0;
    }
  } catch (err) {
    console.error('Error in cartCount middleware:', err);
    res.locals.cartCount = 0;
  }
  next();
});

routeAdmin(app);
routeStaff(app);
routeClient(app);
app.use("/", authRoute);
app.use("/", waitingRoute);
app.use("/", forgotRoute);
app.use('/', catalogRouter);

app.locals.prefixAdmin = systemConfig.prefixAdmin;

database.connect();

//app.listen(port, () => {
//  console.log(`Example app listening on port ${port}`)
//})
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs/dev-selfsigned.key')),
  cert: fs.readFileSync(path.join(__dirname, 'certs/dev-selfsigned.crt')),
};

const PORT = 4000;

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS server running at https://localhost:${PORT}`);
});