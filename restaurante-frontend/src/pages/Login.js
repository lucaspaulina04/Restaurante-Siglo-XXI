import React, { useState } from 'react';
import axios from 'axios';
import { saveToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
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

      const role = JSON.parse(atob(response.data.token.split('.')[1])).role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'cocina') navigate('/cocina');
      else if (role === 'finanzas') navigate('/finanzas');
      else if (role === 'client') navigate('/client');
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
    </div>
  );
};

export default Login;
