const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    console.log('Incoming request to create an order:', req.body); // Log para verificar datos entrantes
    const { product, quantity, customerName } = req.body;

    if (!product || !quantity || !customerName) {
      console.error('Missing required fields'); // Log de campos faltantes
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newOrder = new Order({
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
      },
      quantity,
      customerName,
      status: 'pending',
    });

    await newOrder.save();
    console.log('Order created successfully:', newOrder); // Log de creación exitosa
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error.message); // Log de error
    res.status(500).json({ error: error.message });
  }
};


exports.getOrders = async (req, res) => {
  try {
    console.log('Fetching all orders...'); // Log antes de realizar la consulta

    // Recuperar todas las órdenes
    const orders = await Order.find();
    console.log('Orders fetched successfully:', orders); // Log de las órdenes recuperadas

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message); // Log del error
    res.status(500).json({ error: error.message });
  }

  // Actualizar el estado de una orden
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Recibe el nuevo estado desde el front

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ error: error.message });
  }
};

};
exports.updateOrder = async (req, res) => {
  const { id } = req.params; // Extrae el ID de los parámetros de la solicitud
  const { status } = req.body; // Extrae el estado del cuerpo de la solicitud

  try {
    // Verifica si el ID es un ObjectId válido
    if (!id || id.length !== 24) {
      console.error('Error: ID inválido');
      return res.status(400).json({ error: 'ID inválido' });
    }

    // Busca la orden por ID
    const order = await Order.findById(id);

    if (!order) {
      console.error('Error: Orden no encontrada');
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // Actualiza el estado de la orden
    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Estado de la orden actualizado', order });
  } catch (error) {
    // Debug: Error en el try-catch
    console.error('Error en la actualización:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
