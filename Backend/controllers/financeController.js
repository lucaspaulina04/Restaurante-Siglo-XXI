const Order = require('../models/Order'); // Modelo para las órdenes de los clientes
const SupplierOrder = require('../models/SupplierOrder'); // Modelo para los pedidos a proveedores

exports.getFinanceData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Debe proporcionar startDate y endDate' });
    }

    const start = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T23:59:59.999Z`);

    console.log("Rango de fechas ajustado (UTC):", start, end);

    // Consultar ingresos
    const orders = await Order.find({
      status: "finished",
      date: { $gte: start, $lte: end },
    });

    console.log("Órdenes encontradas:", orders);

    const totalIngresos = orders.reduce((sum, order) => {
      if (order.items && order.items.length > 0) {
        const itemsSum = order.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0);
        return sum + itemsSum;
      }
      if (order.product && order.quantity) {
        return sum + order.product.price * order.quantity;
      }
      return sum;
    }, 0);

    // Consultar egresos
    const supplierOrders = await SupplierOrder.find({
      status: "pending", // Cambiar según sea necesario
      date: { $gte: start, $lte: end },
    });

    console.log("Pedidos a proveedores encontrados:", supplierOrders);

    const totalEgresos = supplierOrders.reduce((sum, order) => sum + order.price, 0);

    const utilidad = totalIngresos - totalEgresos;

    res.status(200).json({
      totalIngresos,
      totalEgresos,
      utilidad,
      ingresosDetalle: orders,
      egresosDetalle: supplierOrders,
    });
  } catch (error) {
    console.error("Error al obtener datos financieros:", error);
    res.status(500).json({ error: "Error al obtener datos financieros" });
  }
};
