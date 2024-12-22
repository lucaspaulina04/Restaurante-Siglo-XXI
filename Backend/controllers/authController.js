const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  console.log('Iniciando proceso de login...');
  console.log('Datos recibidos:', req.body); // Verifica los datos enviados desde el cliente

  const { email, password } = req.body;

  try {
    console.log('Buscando usuario en la base de datos...');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Usuario no encontrado con el email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Usuario encontrado:', user);

    console.log('Comparando contraseñas...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Las contraseñas no coinciden para el usuario:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Contraseña validada. Generando token...');
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('Token generado:', token);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error durante el proceso de login:', error.message);
    res.status(500).json({ error: error.message });
  }
};
