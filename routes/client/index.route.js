const productRoute = require("./product.route");
const homeRoute = require("./home.route");
const searchRoute = require('./search.route');
const catalogRoute = require('./catalog.route');


function routeClient(app) {
    app.use("/product", productRoute);
    app.use("/", homeRoute);
    app.use("/", searchRoute);
    app.use('/', catalogRoute); // Gắn route với path gốc
}

module.exports = routeClient;