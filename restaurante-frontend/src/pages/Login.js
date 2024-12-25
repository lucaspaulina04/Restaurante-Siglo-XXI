import React, { useState } from 'react';
import axios from 'axios';
import { saveToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import HelpButton from '../components/Help';
import '../styles/Login.css'; // Importar los estilos específicos del login

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      saveToken(response.data.token);

      // Decodificar el token para obtener el rol
      const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
      const role = decodedToken.role;

      // Redirigir según el rol del usuario
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'cocina':
          navigate('/cocina');
          break;
        case 'finanzas':
          navigate('/finanzas');
          break;
        case 'client':
          navigate('/client');
          break;
        case 'bodega':
          navigate('/bodega');
          break;
        default:
          alert('Rol desconocido. Contacte al administrador.');
      }
    } catch (error) {
      alert('Login fallido: Verifique sus credenciales.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Restaurante Siglo XXI</h1>
        <p className="login-subtitle">Inicia sesión para continuar</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>
      </div>
      <HelpButton/>
    </div>
  );
};

export default Login;
