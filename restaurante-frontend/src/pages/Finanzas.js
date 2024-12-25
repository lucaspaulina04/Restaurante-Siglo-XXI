import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth'; 
import HelpButton from '../components/Help'; 
import '../styles/Finanzas.css';

const Finanzas = () => {
  const [financeData, setFinanceData] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      navigate('/'); 
    }
  }, [token, navigate]);

  const fetchFinanceData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/finance', {
        params: dateRange,
        headers: { Authorization: `Bearer ${token}` },
      });
      setFinanceData(response.data);
    } catch (error) {
      console.error('Error al obtener datos financieros:', error);
      if (error.response && error.response.status === 401) {
        removeToken(); 
        navigate('/');
      }
    }
  };

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    removeToken(); 
    navigate('/'); 
  };

  return (
    <div className="finanzas-layout">
      <aside className="finanzas-sidebar">
        <h1>Panel de Finanzas</h1>
        <nav>
          <div className="finanzas-menu-item">
            <FontAwesomeIcon icon={faChartBar} /> Finanzas
          </div>
        </nav>
        <button className="finanzas-logout-button" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
        </button>
      </aside>

      
      <main className="finanzas-main-content">
        <h1>Panel de Finanzas</h1>

        
        <section className="finanzas-section">
          <h2>Calcular Ingresos, Egresos y Utilidad</h2>
          <div className="finanzas-form">
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
            <button onClick={fetchFinanceData}>Calcular</button>
          </div>
        </section>

        {financeData && (
          <div>
            <h2>Resultados</h2>
            <table className="finanzas-table">
              <thead>
                <tr>
                  <th>Ingresos</th>
                  <th>Egresos</th>
                  <th>Utilidad</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${financeData.totalIngresos}</td>
                  <td>${financeData.totalEgresos}</td>
                  <td>${financeData.utilidad}</td>
                </tr>
              </tbody>
            </table>

            <h3>Detalle de Ingresos</h3>
            <table className="finanzas-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Total</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {financeData.ingresosDetalle.map((order) => (
                  <tr key={order._id}>
                    <td>{order.product || 'Producto desconocido'}</td>
                    <td>{order.quantity}</td>
                    <td>${order.price * order.quantity}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Detalle de Egresos</h3>
            <table className="finanzas-table">
              <thead>
                <tr>
                  <th>Proveedor</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {financeData.egresosDetalle.map((order) => (
                  <tr key={order._id}>
                    <td>{order.supplierName || 'Proveedor desconocido'}</td>
                    <td>{order.product || 'Producto desconocido'}</td>
                    <td>${order.price}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <HelpButton />
      </main>
    </div>
  );
};

export default Finanzas;
