const path = require('path');
const express = require('express')
require('dotenv').config(); //nhúng env
const database = require("./config/database.js")
const app = express();
const hbs = require('express-handlebars');
const routeClient = require("./routes/client/index.route")
const routeAdmin = require("./routes/admin/index.route")
const systemConfig = require ("./config/system.js")

const port = process.env.PORT;

app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'src/resources/views'));


//Template engine
app.engine('hbs', hbs.engine({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'src/resources/views/client/layouts'),
  partialsDir: path.join(__dirname, 'src/resources/views/client/partials')
})); 

routeAdmin(app);
routeClient(app);

app.locals.prefixAdmin = systemConfig.prefixAdmin;

// database.connect();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

