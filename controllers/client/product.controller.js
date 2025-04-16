const Product = require("../../models/product.model.js")

module.exports.index = async (req,res)=>{
    const products = await Product.find({});
    console.log(products);


    products.forEach(item => {
        item.priceNew = (item.price-(item.price*item.discountPercentage/100)).toFixed(0);
    })
    
    res.render("client/pages/products/index.pug",{
        pageTitle: "Trang danh sách sản phẩm",
        products : products
    });
  }