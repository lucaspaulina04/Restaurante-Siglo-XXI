const express = require('express');
const { getFinanceData } = require('../controllers/financeController');

const router = express.Router();

// Ruta para obtener ingresos, egresos y utilidad
router.get('/', getFinanceData);

module.exports = router;
