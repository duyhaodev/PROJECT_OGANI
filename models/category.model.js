const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  categoryName: {type: String, required: true, unique: true },
  status: {type: String, enum: ["active", "locked"], default: "active" },
  thumbnail: { type: String }
}, {
  timestamps: true 
});


// Tạo model từ schema, gán với collection cụ thể trong MongoDB
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema, "Category");

//  Lấy danh sách tất cả danh mục
const list = async () => {
  const dataList = await Category.find({});
  return dataList.map(cat => cat.toObject()); // chuyển về plain object
};

// Tìm danh mục theo tên
const findByNameCat = async (categoryName) => {
  try {
    const Category = await Category.findOne({ categoryName });
    return Category;
  } catch (err) {
    console.error("❌ Error finding Category by categoryName:", err);
    throw err;
  }
};




// Export các hàm và model nếu muốn dùng riêng
module.exports = {
  list,
  Category,
  findByNameCat,
};



