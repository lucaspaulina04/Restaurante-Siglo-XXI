const express = require('express');
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();
console.log({ createUser, getUsers, updateUser, deleteUser });

router.post('/', (req, res, next) => {
  console.log('Ruta POST /api/users alcanzada para crear usuario');
  next();
}, createUser); // Crear usuario

router.get('/', (req, res, next) => {
  console.log('Ruta GET /api/users alcanzada para obtener usuarios');
  next();
}, getUsers); // Obtener usuarios

router.put('/:id', (req, res, next) => {
  console.log(`Ruta PUT /api/users/${req.params.id} alcanzada para actualizar usuario`);
  next();
}, updateUser); // Actualizar usuario

router.delete('/:id', (req, res, next) => {
  console.log(`Ruta DELETE /api/users/${req.params.id} alcanzada para eliminar usuario`);
  next();
}, deleteUser); // Eliminar usuario

module.exports = router;
