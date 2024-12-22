const mongoose = require('mongoose');

const SupplierOrderSchema = new mongoose.Schema({
  supplierName: { type: String, required: true }, // Nombre del proveedor
  product: { type: String, required: true }, // Nombre del producto
  quantity: { type: Number, required: true }, // Cantidad en kg
  price: { type: Number, required: true }, // Precio del producto
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }, // Estado
  date: { type: Date, default: Date.now }, // Fecha
});

module.exports = mongoose.model('SupplierOrder', SupplierOrderSchema);
