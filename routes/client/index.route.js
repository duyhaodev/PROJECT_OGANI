const productRoute = require("./product.route");
const cartRoute = require("./cart.route");
const homeRoute = require("./home.route");
const infoRoute = require("./info.route");

function routeClient(app) {
    app.use("/product", productRoute);
    app.use("/cart", cartRoute);
    app.use("/info", infoRoute);
    app.use("/", homeRoute);
}

module.exports = routeClient;