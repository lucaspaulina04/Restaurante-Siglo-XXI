const express = require('express');
const { login } = require('../controllers/authController');
const router = express.Router();

console.log('Cargando rutas de autenticación...');

router.post('/login', (req, res, next) => {
  console.log('Solicitud recibida en POST /login');
  console.log('Cuerpo de la solicitud:', req.body); // Muestra los datos enviados en la solicitud
  next(); // Continúa al controlador
}, login); // Llama al controlador login

console.log('Ruta POST /login configurada correctamente');

module.exports = router;
