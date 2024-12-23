const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Configurar variables de entorno
dotenv.config();
console.log('Variables de entorno cargadas');

// Inicializar la aplicación
const app = express();
console.log('Aplicación Express inicializada');

// Middleware
app.use(express.json());
console.log('Middleware JSON habilitado');

app.use(cors());
console.log('Middleware CORS habilitado');

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Middleware para verificar cada solicitud entrante
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Configuración de rutas
try {
  const userRoutes = require('./routes/userRoutes');
  const authRoutes = require('./routes/authRoutes');
  const productRoutes = require('./routes/productRoutes');
  const supplierOrderRoutes = require('./routes/supplierOrderRoutes');
  const orderRoutes = require('./routes/orderRoutes');
  const financeRoutes = require('./routes/financeRoutes');

  app.use('/api/users', userRoutes);
  console.log('Rutas de usuarios cargadas correctamente');

  app.use('/api/orders', orderRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/supplier-orders', supplierOrderRoutes);
  app.use('/api/finance', financeRoutes);
  
  console.log('Rutas de autenticación cargadas correctamente');
  console.log('Rutas de productos cargadas correctamente');
  console.log('Rutas de pedidos a proveedores cargadas correctamente');
} catch (error) {
  console.log('Error al cargar rutas:', error.message);
}



// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
