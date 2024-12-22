import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Cocina.css';

const CocinaPanel = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      console.log('Datos recibidos:', response.data); // Depuración
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status });
      alert(`Estado de la orden actualizado a ${status}`);
      fetchOrders(); // Refrescar las órdenes después de la actualización
    } catch (error) {
      console.error('Error updating order status:', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token
    window.location.href = '/'; // Redirigir al login
  };

  return (
    <div className="cocina-layout">
      <aside className="sidebar">
        <h1>Panel Cocina</h1>
        <nav>
          <a href="/cocina">Tablero de Órdenes</a>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          <span>🔑</span> Cerrar Sesión
        </button>
      </aside>
      <main className="main-content">
        <h1>Tablero de Órdenes</h1>
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className={`order-card ${order.status}`}>
              <h3>{order.product?.name || 'Producto no definido'}</h3>
              <p>Cliente: {order.customerName || 'Cliente desconocido'}</p>
              <p>Cantidad: {order.quantity || 0}</p>
              <p>Estado: {order.status || 'Sin estado'}</p>
              <p>Fecha: {order.date ? new Date(order.date).toLocaleString() : 'Sin fecha'}</p>
              <div className="actions">
                {order.status === 'pending' && (
                  <button onClick={() => updateOrderStatus(order._id, 'in-progress')}>
                    En Proceso
                  </button>
                )}
                {order.status === 'in-progress' && (
                  <>
                    <button onClick={() => updateOrderStatus(order._id, 'ready')}>
                      Listo para Servir
                    </button>
                    <button onClick={() => updateOrderStatus(order._id, 'finished')}>
                      Finalizar
                    </button>
                  </>
                )}
                {order.status === 'ready' && (
                  <button onClick={() => updateOrderStatus(order._id, 'finished')}>
                    Finalizar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CocinaPanel;
