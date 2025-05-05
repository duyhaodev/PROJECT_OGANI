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





// module.exports = {
//   list,
//   Category,
//   findByNameCat,
// };




module.exports = Category;
