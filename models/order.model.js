const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
    productId: { type: String, required: true }, 
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const ShippingSchema =new mongoose.Schema({
    address: { type: String, required: true },
    receiverName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    shippingMethod: { type: String },
    shippingFee: { type: Number }
});

const PromotionSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    percentDiscount: { type: Number },
    code: { type: String }
});

const CustomerSchema = new mongoose.Schema({
    fullName: String,
    emailAddress: { type: String },
    phoneNumber: { type: String },
    membership: { type: String }, // VIP, GOLD, SILVER...
});
const orderSchema = new mongoose.Schema(
    {
    product: [OrderItemSchema],           
    customer: CustomerSchema,             
    shipping: ShippingSchema,             
    vat: { type: Number, required: true }, 
    promotions: [PromotionSchema],         
    note: {type: String },
    status: {type: String, },                  //['Pending', 'Confirmed', 'Shipping', 'Completed', 'Cancelled']
    orderDate: { type: Date, default: Date.now }
});


const Order = mongoose.model("Order", orderSchema, "order")

module.exports = Order;