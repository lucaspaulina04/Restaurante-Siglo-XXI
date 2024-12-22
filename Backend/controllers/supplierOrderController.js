const SupplierOrder = require('../models/SupplierOrder');

exports.createOrder = async (req, res) => {
  console.log('[createOrder] Payload recibido:', req.body);

  try {
    const { supplierName, product, quantity, price, status } = req.body;

    if (!supplierName || !product || !quantity || !price) {
      console.log('[createOrder] Campos faltantes');
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const order = new SupplierOrder({
      supplierName,
      product,
      quantity,
      price,
      status,
    });

    await order.save();
    console.log('[createOrder] Pedido creado correctamente:', order);
    res.status(201).json({ message: 'Pedido creado correctamente', order });
  } catch (error) {
    console.error('[createOrder] Error al crear el pedido:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  console.log('[getOrders] Solicitando todos los pedidos');

  try {
    const orders = await SupplierOrder.find();
    console.log('[getOrders] Pedidos obtenidos:', orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error('[getOrders] Error al obtener pedidos:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  console.log('[deleteOrder] Solicitando eliminación de pedido con ID:', id);

  try {
    const order = await SupplierOrder.findByIdAndDelete(id);
    if (!order) {
      console.log('[deleteOrder] Pedido no encontrado');
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    console.log('[deleteOrder] Pedido eliminado correctamente:', order);
    res.status(200).json({ message: 'Pedido eliminado correctamente' });
  } catch (error) {
    console.error('[deleteOrder] Error al eliminar el pedido:', error.message);
    res.status(500).json({ error: error.message });
  }
};
