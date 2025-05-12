const staffRoute = require ("./staff.route")
const { checkStaffRole } = require("../../middleware/role.middleware"); // Import middleware kiểm tra quyền Staff

function routeStaff(app) {
    app.use("/staff", checkStaffRole);
    
    app.use("/staff", staffRoute)
}

module.exports = routeStaff