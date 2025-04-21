
module.exports.index = (req,res)=>{
    res.render("client/pages/home",{
        layout: 'main',
        pageTitle : "Trang chủ"
    });
  }