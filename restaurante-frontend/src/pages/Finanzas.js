import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth'; // Asegúrate de tener esta función para manejar el token.
import '../styles/Finanzas.css';

const Finanzas = () => {
  const [financeData, setFinanceData] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const navigate = useNavigate(); // Para redirigir al usuario.

  const fetchFinanceData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/finance', {
        params: dateRange,
      });
      setFinanceData(response.data);
    } catch (error) {
      console.error('Error al obtener datos financieros:', error);
    }
  };

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    removeToken(); // Elimina el token de autenticación.
    navigate('/'); // Redirige a la página de inicio de sesión.
  };

  return (
    <div className="finanzas-layout">
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="finanzas-main-content">
        <h1>Panel de Finanzas</h1>

        {/* Filtros por rango de fechas */}
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

        {/* Resultados */}
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
                  <React.Fragment key={order._id}>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <tr key={`${order._id}-${index}`}>
                          <td>{item.product || "Producto desconocido"}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price * item.quantity}</td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : order.product ? (
                      <tr>
                        <td>{order.product.name || "Producto desconocido"}</td>
                        <td>{order.quantity}</td>
                        <td>${order.product.price * order.quantity}</td>
                        <td>{new Date(order.date).toLocaleDateString()}</td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan="4">Datos incompletos</td>
                      </tr>
                    )}
                  </React.Fragment>
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
                    <td>{order.supplierName || "Proveedor desconocido"}</td>
                    <td>{order.product || "Producto desconocido"}</td>
                    <td>${order.price}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Finanzas;
