const express = require('express');
const router = express.Router();
const bodegaController = require('../controllers/bodegaController');

router.get('/', bodegaController.obtenerProductos);
router.post('/', bodegaController.agregarProducto);
router.put('/:id', bodegaController.actualizarProducto);
router.delete('/:id', bodegaController.eliminarProducto);

module.exports = router;
