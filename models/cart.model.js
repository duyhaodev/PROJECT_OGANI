const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    sellPrice: { type: Number, required: true },
    thumbnail: { type: String },
    quantity: { type: Number },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
}, {
    timestamps: true
});

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
    addedAt: { type: Date, default: Date.now }
});


// const cartSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
//     items: { type: [cartItemSchema], default: [] }
// }, {
//     timestamps: true
// });

module.exports = mongoose.model('Cart', cartSchema, 'cart');