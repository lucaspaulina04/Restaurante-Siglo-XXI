const express = require('express');
const { login } = require('../controllers/authController');
const router = express.Router();

console.log('Cargando rutas de autenticación...');

router.post('/login',login); // Llama al controlador login

module.exports = router;
