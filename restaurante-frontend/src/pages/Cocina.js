import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUtensils,faClipboard } from '@fortawesome/free-solid-svg-icons';
import { getToken, removeToken } from '../utils/auth';
import HelpButton from '../components/Help';
import '../styles/Cocina.css';

const CocinaPanel = () => {
  const [orders, setOrders] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // Manejo de tabs
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      navigate('/'); // Redirige si no hay token
    } else {
      fetchOrders();
      fetchRecipes(); // Traer recetas al cargar
    }
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      if (error.response && error.response.status === 401) {
        removeToken();
        navigate('/');
      }
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/receta', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
      if (error.response && error.response.status === 401) {
        removeToken();
        navigate('/');
      }
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Estado de la orden actualizado a ${status}`);
      fetchOrders(); // Actualizar lista de órdenes
    } catch (error) {
      console.error('Error updating order status:', error.message);
      if (error.response && error.response.status === 401) {
        removeToken();
        navigate('/');
      }
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/'); // Redirige al login
  };

  return (
    <div className="cocina-layout">
      <aside className="sidebar">
        <h1>Panel Cocina</h1>
        <nav>
          <div className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
           <FontAwesomeIcon icon={faClipboard} /> Tablero de Órdenes
          </div>
          <div className={activeTab === 'recipes' ? 'active' : ''} onClick={() => setActiveTab('recipes')}>
            <FontAwesomeIcon icon={faUtensils} /> Recetas
          </div>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
        </button>
      </aside>
      <main className="main-content">
        {activeTab === 'orders' && (
          <div>
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
          </div>
        )}
        {activeTab === 'recipes' && (
          <div>
            <h1>Lista de Recetas</h1>
            <div className="recipes-grid">
              {recipes.map((recipe) => (
                <div key={recipe._id} className="recipe-card">
                  <h3>{recipe.nombre}</h3>
                  <ul>
                    {recipe.ingredientes.map((ingrediente, index) => (
                      <li key={index}>
                        {ingrediente.nombre} - {ingrediente.cantidad} {ingrediente.unidadMedida}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
        <HelpButton />
      </main>
    </div>
  );
};

export default CocinaPanel;
