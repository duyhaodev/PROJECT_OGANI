const productRoute = require("./product.route")
const cartRoute = require("./cart.route")
const homeRoute = require("./home.route")

function routeClient(app) {
    app.use("/product", productRoute);
    app.use("/cart", cartRoute);
    app.use("/", homeRoute);
}

module.exports = routeClient;