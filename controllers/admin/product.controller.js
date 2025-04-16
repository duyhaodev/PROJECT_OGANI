const Product = require ("../../models/product.model.js")


module.exports.index = async (req,res) =>{
    const filterStatus = [
      {
        name: "Tất cả",
        status : "",
        class :""
      },
      {
        name: "Hoạt động",
        status : "active",
        class :""
      },
      {
        name: "Dừng hoạt động",
        status : "inactive",
        class :""
      },
  ]
    if(req.query.status){
      const index = filterStatus.findIndex(item => item.status == req.query.status);
      filterStatus[index].class = "active";
    }

    let find = { 
      deleted : false,
    }
    if(req.query.status){
      find.status = req.query.status;
    } 
    const products = await Product.find(find);
    // console.log(products);

    res.render("admin/pages/product/index.pug",{
      pageTitle : "Trang Admin",
      products : products,
      filterStatus : filterStatus

  });
}


