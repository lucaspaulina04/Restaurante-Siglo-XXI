const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  product: {
    id: String,
    name: String,
    price: Number,
  },
  customerName: String,
  quantity: Number,
  status: { type: String, default: 'pending' },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
