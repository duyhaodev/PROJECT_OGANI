const mongoose = require("mongoose");
const sanitizeHtml = require('sanitize-html');

const sanitizeOptions = {
  allowedTags: [], // Không cho phép bất kỳ thẻ HTML nào
  allowedAttributes: {}, // Không cho phép thuộc tính HTML nào
  disallowedTagsMode: 'discard',
};

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
  views: { type: Number, default: 0 }
}, {
  timestamps: true
});


// 🔒 Khi update qua findOneAndUpdate cũng phải sanitize
productSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  const fieldsToSanitize = ['title', 'slug', 'description', 'producer', 'thumbnail', 'import'];
  for (const field of fieldsToSanitize) {
    if (update[field]) {
      update[field] = sanitizeHtml(update[field], sanitizeOptions);
    }
  }

  // ✅ Check javascript: trong thumbnail
  if (update.thumbnail && update.thumbnail.startsWith('javascript:')) {
    update.thumbnail = '';
  }

  this.setUpdate(update);
  next();
});

module.exports = mongoose.model('Product', productSchema);




