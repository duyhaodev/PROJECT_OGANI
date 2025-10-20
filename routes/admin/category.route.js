const express = require ("express");
const router = express.Router();
const AdminCateController =  require ("../../controllers/admin/category.controller")
const {csrfProtection, injectCsrf} = require('../../middleware/csrf.middleware');


router.get("/", AdminCateController.category)
router.get("/add", AdminCateController.addForm); 
router.post("/insert", AdminCateController.addSave); 
router.get("/delete/:id", AdminCateController.delete);
router.get("/view/:id", csrfProtection, injectCsrf, AdminCateController.viewProductsByCategory);
//csrfProtection sinh crfToken
//injectCsrf đưa csrfToken vào view
router.get("/edit/:id", AdminCateController.showEditForm);
router.post("/update/:id", AdminCateController.updateCategory);
module.exports = router;
