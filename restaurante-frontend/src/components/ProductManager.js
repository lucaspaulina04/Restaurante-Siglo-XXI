import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth'; // Importa las funciones para el manejo del token
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import HelpButton from './Help';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
  });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate(); // Hook para la navegación
  const token = getToken(); // Obtiene el token

  useEffect(() => {
    if (!token) {
      navigate('/'); // Redirige al login si no hay token
    } else {
      fetchProducts(); // Obtiene los productos si hay token válido
    }
  }, [token, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      if (error.response && error.response.status === 401) {
        removeToken(); // Elimina el token si no es válido
        navigate('/'); // Redirige al inicio de sesión
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/products/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/api/products', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({ name: '', price: '', stock: '', category: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error al enviar datos:', error);
      if (error.response && error.response.status === 401) {
        removeToken();
        navigate('/');
      }
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditId(product._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      if (error.response && error.response.status === 401) {
        removeToken();
        navigate('/');
      }
    }
  };

  return (
    <div>
      <h2>Gestión de Productos</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          placeholder="Nombre"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Categoría"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        />
        <button type="submit">{editId ? 'Actualizar Producto' : 'Agregar Producto'}</button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>{product.category}</td>
              <td>
                <button
                  onClick={() => handleEdit(product)}
                  className="edit-button"
                  title="Editar"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="delete-button"
                  title="Eliminar"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <HelpButton/>
    </div>
  );
};

export default ProductManager;
