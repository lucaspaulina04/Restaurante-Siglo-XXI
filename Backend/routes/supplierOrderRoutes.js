const express = require('express');
const { createOrder, getOrders, deleteOrder } = require('../controllers/supplierOrderController');

const router = express.Router();

// Ruta para crear un pedido
router.post('/', (req, res, next) => {
  console.log('[POST /] Solicitud recibida para crear un pedido');
  next();
}, createOrder);

// Ruta para obtener todos los pedidos
router.get('/', (req, res, next) => {
  console.log('[GET /] Solicitud recibida para obtener todos los pedidos');
  next();
}, getOrders);

// Ruta para eliminar un pedido por ID
router.delete('/:id', (req, res, next) => {
  console.log('[DELETE /:id] Solicitud recibida para eliminar un pedido');
  next();
}, deleteOrder);

module.exports = router;
