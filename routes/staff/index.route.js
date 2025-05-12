const orderRoute = require ("./staffOrder.route")
const staffRoute = require ("./staffSupport.route")
const { checkStaffRole } = require("../../middleware/role.middleware"); // Import middleware kiểm tra quyền Staff

function routeStaff(app) {
    app.use("/staff", checkStaffRole);
    
    app.use("/staff", orderRoute)

    app.use("/staff/order", orderRoute)

    app.use("/support", staffRoute)

}

module.exports = routeStaff