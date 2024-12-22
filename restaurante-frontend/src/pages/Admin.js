import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';
import ProductManager from '../components/ProductManager';
import SupplierOrderManager from '../components/SupplierOrderManager';
import Reports from '../components/Reports';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrashAlt,
  faUser,
  faBox,
  faChartBar,
  faClipboard,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Admin.css';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
  });
  const [editUserId, setEditUserId] = useState(null);
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/'); // Redirige al inicio de sesión
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 style={{ color: '#ffffff' }}>Panel Admin</h1>
        <nav>
          <Link to="/admin/users">
            <FontAwesomeIcon icon={faUser} /> Gestión de Usuarios
          </Link>
          <Link to="/admin/products">
            <FontAwesomeIcon icon={faBox} /> Gestión de Productos
          </Link>
          <Link to="/admin/orders">
            <FontAwesomeIcon icon={faClipboard} /> Pedidos a Proveedores
          </Link>
          <Link to="/admin/reports">
            <FontAwesomeIcon icon={faChartBar} /> Reportes
          </Link>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="users" element={<UserManager />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="orders" element={<SupplierOrderManager />} />
          <Route path="reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
};

const UserManager = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
  });
  const [editUserId, setEditUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const token = getToken();

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUserId) {
        await axios.put(`http://localhost:5000/api/users/${editUserId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Usuario actualizado correctamente');
      } else {
        await axios.post('http://localhost:5000/api/users', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Usuario creado correctamente');
      }
      setFormData({ name: '', email: '', password: '', role: 'client' });
      setEditUserId(null);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditUserId(user._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Usuario eliminado correctamente');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          placeholder="Nombre"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!editUserId}
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="client">Cliente</option>
          <option value="cocina">Cocina</option>
          <option value="finanzas">Finanzas</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit">{editUserId ? 'Actualizar' : 'Crear'}</button>
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user)} className="edit-button">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(user._id)} className="delete-button">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
