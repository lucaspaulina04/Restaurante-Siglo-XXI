import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa el hook para navegación
import axios from 'axios';
import '../styles/Cliente.css';

const ClientPanel = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const navigate = useNavigate(); // Inicializa el hook de navegación

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
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
      console.log('Sending order data:', orderData);
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      alert('Pedido creado con éxito');
      console.log('Order response:', response.data);
    } catch (error) {
      console.error('Error creating order:', error.message);
      alert('Error al crear el pedido');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token almacenado
    navigate('/'); // Redirige al inicio de sesión
  };

  return (
    <div className="client-layout">
      <aside className="sidebar">
        <h1>Panel Cliente</h1>
        <nav>
          <a href="#catalogo">Catálogo</a>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          <i className="fa fa-sign-out" aria-hidden="true"></i> Cerrar Sesión
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
      </main>
    </div>
  );
};

export default ClientPanel;
