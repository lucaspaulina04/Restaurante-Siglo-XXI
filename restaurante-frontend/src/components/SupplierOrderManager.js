import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplierOrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    supplierName: '',
    product: '',
    quantity: 0,
    price: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...');
      const response = await axios.get('http://localhost:5000/api/supplier-orders');
      console.log('Orders fetched:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating order:', formData);
      await axios.post('http://localhost:5000/api/supplier-orders', formData);
      setFormData({ supplierName: '', product: '', quantity: 0, price: 0 });
      fetchOrders();
    } catch (error) {
      console.error('Error al crear pedido:', error);
    }
  };

  return (
    <div>
      <h2>Pedidos a Proveedores</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          placeholder="Nombre del Proveedor"
          value={formData.supplierName}
          onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Producto"
          value={formData.product}
          onChange={(e) => setFormData({ ...formData, product: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Cantidad (kg)"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <button type="submit">Crear Pedido</button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Proveedor</th>
            <th>Producto</th>
            <th>Cantidad (kg)</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.supplierName}</td>
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td>{order.price}</td>
              <td>{order.status}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierOrderManager;
