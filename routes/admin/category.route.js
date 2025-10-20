const express = require ("express");
const router = express.Router();
const AdminCateController =  require ("../../controllers/admin/category.controller")
const csrfProtection = require('../../middleware/csrf.middleware');
const injectCsrf = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

router.get("/", AdminCateController.category)
router.get("/add", AdminCateController.addForm); 
router.post("/insert", AdminCateController.addSave); 
router.get("/delete/:id", AdminCateController.delete);
router.get("/view/:id", csrfProtection, injectCsrf, AdminCateController.viewProductsByCategory);
//csrfProtection bật CSRF chỉ cho route này
//injectCsrf đưa csrfToken vào view
router.get("/edit/:id", AdminCateController.showEditForm);
router.post("/update/:id", AdminCateController.updateCategory);
module.exports = router;
