const productRoute = require ("./product.route")
const systemConfig = require ("../../config/system")
const dashboardRoute = require ("./dashboard.route")

function routeAdmin(app) {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + "/dashboard", dashboardRoute);
    
    app.use(PATH_ADMIN + "/product", productRoute);

    app.use(PATH_ADMIN, productRoute);
}

module.exports = routeAdmin
