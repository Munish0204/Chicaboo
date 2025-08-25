// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      name: String,
      image: String,
      price: Number,
      quantity: Number,
    },
  ],
  total: Number,
  transactionId: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);
