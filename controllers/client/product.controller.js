const Product = require("../../models/product.model.js")

class ProductController {
    
    index(req,res) {
        res.render("client/pages/shop-grid",{
            layout: 'main',
            pageTitle : "Shop"
        });
    }
    
    show(req,res){
        res.render("client/pages/product-details",{
            layout: 'main',
            pageTitle : "Product details"
        });
      }
    }

module.exports = new ProductController();