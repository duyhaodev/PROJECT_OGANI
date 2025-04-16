const express = require('express')
require('dotenv').config(); //nhúng env
const database = require("./config/database.js")
const app = express();
const routeClient = require("./routes/client/index.route")
const routeAdmin = require("./routes/admin/index.route")
const systemConfig = require ("./config/system.js")

const port = process.env.PORT;

app.set('views', './views');
app.set('view engine', 'pug');


app.use(express.static("public"));  //nhúng file tĩnh bootstrap

routeAdmin(app);
routeClient(app);

app.locals.prefixAdmin = systemConfig.prefixAdmin;

database.connect();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

