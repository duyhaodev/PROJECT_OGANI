const mongoose = require('mongoose');

// Schema cho danh mục (catalog)
const catalogSchema = new mongoose.Schema({
  nameCat: {
    type: String,
    required: true
    // Bạn có thể thêm: unique: true nếu muốn tên danh mục là duy nhất
  },
});


// Tạo model từ schema, gán với collection cụ thể trong MongoDB
const Catalog = mongoose.models.Catalog || mongoose.model("Catalog", catalogSchema, "catalog");

//  Lấy danh sách tất cả danh mục
const list = async () => {
  const dataList = await Catalog.find({});
  return dataList.map(cat => cat.toObject()); // chuyển về plain object
};

// Tìm danh mục theo tên
const findByNameCat = async (nameCat) => {
  try {
    const catalog = await Catalog.findOne({ nameCat });
    return catalog;
  } catch (err) {
    console.error("❌ Error finding catalog by nameCat:", err);
    throw err;
  }
};




// Export các hàm và model nếu muốn dùng riêng
module.exports = {
  list,
  Catalog,
  findByNameCat,
};
