const path = require('path');
const express = require('express');
const session = require('express-session');
const moment = require('moment');
require('dotenv').config();
const Swal = require('sweetalert2');

const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const hbs = require('express-handlebars');

const database = require("./config/database.js");
const systemConfig = require("./config/system.js");

const loadCatalogList = require('./middleware/catalog.middleware.js');
const Cart = require('./models/cart.model');

const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const routeStaff = require("./routes/staff/index.route");
const authRoute = require("./routes/auth.route");
const waitingRoute = require("./routes/waiting.route");
const forgotRoute = require("./routes/forgot.route");
const catalogRouter = require('./routes/client/catalog.route');

const app = express();

// =============== CẤU HÌNH CƠ BẢN ===============
const port = process.env.PORT;
const session_secret = process.env.SESSION_SECRET;

// Static file
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Middleware chung
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(loadCatalogList);

// =============== SESSION ===============
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true, 
    sameSite: 'lax', 
    secure: process.env.NODE_ENV === 'production' 
  }
}));
// =============== CSRF BẢO VỆ ===============
const csrfProtection = csrf({ cookie: true });

// Apply CSRF protection to all routes
app.use(csrfProtection);

// Make CSRF token available to all views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : '';
  next();
});

// Error handling middleware (add this after all other middleware and routes)
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ 
      success: false,
      error: 'Invalid CSRF token' 
    });
  }
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!' 
  });
});

// =============== HANDLEBARS ENGINE ===============
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
      for (let i = start; i <= end; i++) range.push(i);
      return range;
    },
    isActive: (page, currentPage) => (page === currentPage ? 'active' : ''),
  },
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/resources/views'));

// =============== MIDDLEWARE GIỎ HÀNG ===============
app.use(async (req, res, next) => {
  try {
    if (req.session.user) {
      const cart = await Cart.findOne({ userId: req.session.user._id }).lean();
      res.locals.cartCount = cart ? cart.items.reduce((sum, i) => sum + i.quantity, 0) : 0;
    } else {
      res.locals.cartCount = 0;
    }
  } catch (err) {
    console.error('Error in cartCount middleware:', err);
    res.locals.cartCount = 0;
  }
  next();
});

// =============== ROUTES ===============
routeAdmin(app);
routeStaff(app);
routeClient(app);
app.use("/", authRoute);
app.use("/", waitingRoute);
app.use("/", forgotRoute);
app.use('/', catalogRouter);

// =============== SYSTEM CONFIG ===============
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// =============== DATABASE & SERVER ===============
database.connect();
app.listen(port, () => console.log(`Server running on port ${port}`));
