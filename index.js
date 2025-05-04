const path = require('path');
const express = require('express');
const session = require('express-session');
const moment = require('moment');


// require('dotenv').config(); //nhúng env
const Cart = require('./models/cart.model');
const database = require("./config/database.js");
const app = express();
const hbs = require('express-handlebars');
const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const authRoute = require("./routes/auth.route");
const waitingRoute = require("./routes/waiting.route");
const systemConfig = require("./config/system.js")

const port = 3000;

app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "HuuThong15082004", // Thay bằng một chuỗi bí mật của bạn
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Đặt `secure: true` nếu sử dụng HTTPS
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
    multiply: (a, b) => {
      return a * b;
    },
    formatDate: (date, format) => {
      const safeFormat = typeof format === 'string' ? format : 'DD/MM/YYYY';
      return moment(date).format(safeFormat);
    }
  }
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
routeClient(app);
app.use("/", authRoute);
app.use("/", waitingRoute);

app.locals.prefixAdmin = systemConfig.prefixAdmin;

database.connect();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

