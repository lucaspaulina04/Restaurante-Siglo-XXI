import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para manejar la navegación
import { getToken, removeToken } from '../utils/auth'; // Importa las funciones de token
import HelpButton from'../components/Help';

const SupplierOrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    supplierName: '',
    product: '',
    quantity: 0,
    price: 0,
  });
  const navigate = useNavigate(); // Inicializa el hook para la navegación
  const token = getToken(); // Obtiene el token almacenado

  useEffect(() => {
    if (!token) {
      navigate('/'); // Redirige al inicio de sesión si no hay token
    } else {
      fetchOrders();
    }
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/supplier-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      if (error.response && error.response.status === 401) {
        removeToken(); // Elimina el token si no es válido
        navigate('/'); // Redirige al inicio de sesión
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/supplier-orders',
        formData,
        { headers: { Authorization: `Bearer ${token}` } } // Incluye el token en la cabecera
      );
      setFormData({ supplierName: '', product: '', quantity: 0, price: 0 });
      fetchOrders(); // Actualiza la lista de pedidos
    } catch (error) {
      console.error('Error al crear pedido:', error);
      if (error.response && error.response.status === 401) {
        removeToken(); // Elimina el token si no es válido
        navigate('/'); // Redirige al inicio de sesión
      }
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
      <HelpButton/>
    </div>
  );
};

export default SupplierOrderManager;
