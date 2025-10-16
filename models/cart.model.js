const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
    addedAt: { type: Date, default: Date.now }
});

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [cartItemSchema], default: [] }
}, {
    timestamps: true,
    collection: 'carts'
});

//Phuc edit
cartSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);