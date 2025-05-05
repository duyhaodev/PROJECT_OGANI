const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'locked'], default: 'active' },
  thumbnail: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);