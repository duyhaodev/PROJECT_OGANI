const mongoose = require('mongoose');

// Schema cho danh mục (catalog)
const catalogSchema = new mongoose.Schema({
  nameCat: {
    type: String,
    required: true
    // Bạn có thể thêm: unique: true nếu muốn tên danh mục là duy nhất
  },
 
});

// Schema cho sản phẩm (product)
const productSchema = new mongoose.Schema({
  nameProduct: {
    type: String,
    required: true
  },
  idCat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Catalog',
    required: true
  },
  price: Number,
  desc: String,
  dateUpdate: {
    type: Date,
    default: Date.now
  }
});

// Tạo model từ schema, gán với collection cụ thể trong MongoDB
const Catalog = mongoose.models.Catalog || mongoose.model("Catalog", catalogSchema, "catalog");
const Product = mongoose.models.Product || mongoose.model("Product", productSchema, "products");

//  Lấy danh sách tất cả danh mục
const list = async () => {
  try {
    const dataList = await Catalog.find({});
    return dataList;
  } catch (err) {
    console.error('❌ Error fetching catalog list:', err);
    throw err;
  }
};

//  Lấy danh sách sản phẩm theo tên danh mục
const listByName = async (nameCat) => {
  try {
    const cat = await Catalog.findOne({ nameCat: nameCat });
    if (!cat) return [];

    const products = await Product.find({ idCat: cat._id });
    return products;
  } catch (err) {
    console.error('❌ Error fetching products by category name:', err);
    throw err;
  }
};

// Export các hàm và model nếu muốn dùng riêng
module.exports = {
  list,
  listByName,
  Catalog,
  Product
};
