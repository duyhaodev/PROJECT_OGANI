const path = require('path');
const express = require('express')
require('dotenv').config(); //nhúng env
const database = require("./config/database.js")
const app = express();
const hbs = require('express-handlebars');
const routeClient = require("./routes/client/index.route")
const routeAdmin = require("./routes/admin/index.route")
const authRoute = require("./routes/auth.route");
const waitingRoute = require("./routes/waiting.route");
const systemConfig = require ("./config/system.js")
const session = require("express-session");

const port = process.env.PORT;

app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "DuyHao25092004", // Thay bằng một chuỗi bí mật của bạn
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
    }
  }
}));


routeAdmin(app);
routeClient(app);
app.use("/", authRoute);
app.use("/", waitingRoute);

app.locals.prefixAdmin = systemConfig.prefixAdmin;

database.connect();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

