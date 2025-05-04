const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    categoryId: { type: String, required: true },
    description: { type: String },
    sellPrice: { type: Number, required: true },
    mfg: { type: Date },
    exp: { type: Date },
    producer: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    sellDate: { type: Date },
    import: { type: String, required: true },
    thumbnail: { type: String },
    views: { type: Number, default: 0 } // thêm views để dùng với hotProduct
  }, {
    timestamps: true // tự động thêm createdAt & updatedAt
  });


const Product = mongoose.model("Product", productSchema, "products")

module.exports = Product;