const mongoose = require("mongoose");

// Định nghĩa schema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Catalog" },
  description: { type: String },
  sellPrice: { type: Number, required: true },
  mfg: { type: Date },
  exp: { type: Date },
  producer: { type: String },
  status: { type: String, enum: ["IN_STOCK", "OUT_OF_DATE", "SOLD", "ON_SALE"], default: "IN_STOCK" },
  active: { type: String, enum: ["active", "inactive"], default: "active" },
  sellDate: { type: Date },
  import: { type: String, required: true },
  thumbnail: { type: String },
  views: { type: Number, default: 0 } // thêm views để dùng với hotProduct
}, {
  timestamps: true
});


// Model
const Product = mongoose.models.Product || mongoose.model("Product", productSchema, "products");

// Các hàm tiện ích
const list = async () => Product.find({});
const detail = async (_id) => Product.findById(_id).lean();
const findBySlug = async (slug) => {
  try {
    const product = await Product.findOne({ slug }).lean();
    return product;
  } catch (err) {
    console.error("❌ Lỗi khi tìm sản phẩm theo slug:", err);
    throw err;
  }
};
const findByName = async (keyword) => {
  const regex = new RegExp(keyword, "i");
  return await Product.find({ title: regex }).lean();
};
const find = async (filter) => {
  try {
    return await Product.find(filter).lean(); // ✅ Thêm lean() ở đây
  } catch (err) {
    console.error("❌ Error finding products:", err);
    throw err;
  }
};



// Export
module.exports = {
  Product,
  list,
  findBySlug,
  detail,
  findByName,
  find,
};