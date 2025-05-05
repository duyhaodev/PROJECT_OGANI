const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String },
  categoryId: { type: String, required: true },
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

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
