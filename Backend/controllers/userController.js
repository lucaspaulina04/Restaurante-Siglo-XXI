const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Crear usuario
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log('Iniciando creación de usuario con datos:', req.body);

  try {
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    console.log('Usuario creado exitosamente:', newUser);

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error al crear usuario:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
  console.log('Iniciando proceso para obtener usuarios...');

  try {
    const users = await User.find();
    console.log('Usuarios encontrados:', users);

    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  console.log(`Iniciando actualización de usuario con ID ${id} y datos:`, req.body);

  try {
    // Verificar si el usuario existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Actualizar usuario
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true, runValidators: true }
    );
    console.log('Usuario actualizado:', updatedUser);

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error al actualizar usuario:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log(`Iniciando eliminación de usuario con ID ${id}`);

  try {
    // Verificar si el usuario existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Eliminar usuario
    await User.findByIdAndDelete(id);
    console.log('Usuario eliminado exitosamente');

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error.message);
    res.status(500).json({ error: error.message });
  }
};
