const mongoose = require("mongoose");

// Định nghĩa schema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Category" },
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





module.exports =Product
  // list,
  // findBySlug,
  // detail,
  // findByName,
  // find,
