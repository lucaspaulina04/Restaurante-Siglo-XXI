import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';
import HelpButton from '../components/Help'; 
import '../styles/Cliente.css';

const ClientPanel = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const navigate = useNavigate();
  const token = getToken(); 
  useEffect(() => {
    if (!token) {
      navigate('/'); 
    } else {
      fetchProducts();
    }
  }, [token, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      if (error.response && error.response.status === 401) {
        removeToken(); 
        navigate('/');
      }
    }
  };

  const handleOrder = async () => {
    if (!selectedProduct) {
      alert('Por favor, selecciona un producto');
      return;
    }

    try {
      const orderData = {
        product: {
          id: selectedProduct._id,
          name: selectedProduct.name,
          price: selectedProduct.price,
        },
        quantity,
        customerName,
      };
      await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Pedido creado con éxito');
    } catch (error) {
      console.error('Error creating order:', error.message);
      if (error.response && error.response.status === 401) {
        removeToken();
        navigate('/');
      } else {
        alert('Error al crear el pedido');
      }
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <div className="client-layout">
      <aside className="sidebar">
        <h1>Panel Cliente</h1>
        <nav>
          <a href="#catalogo">Catálogo</a>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
        </button>
      </aside>
      <main className="main-content">
        <h1>Catálogo de Productos</h1>
        <div className="catalog">
          {products.map((product) => (
            <div key={product._id} className="catalog-item">
              <h3>{product.name}</h3>
              <p>Precio: ${product.price}</p>
              <button onClick={() => setSelectedProduct(product)}>Seleccionar</button>
            </div>
          ))}
        </div>

        <h2>Detalles del Pedido</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleOrder();
          }}
          className="order-form"
        >
          <input
            type="text"
            placeholder="Tu Nombre"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <input
            type="number"
            min="1"
            placeholder="Cantidad"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <button type="submit" className="place-order">
            Hacer Pedido
          </button>
        </form>
        <HelpButton /> 
      </main>
    </div>
  );
};

export default ClientPanel;
