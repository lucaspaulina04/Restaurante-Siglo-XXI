import React from 'react';
import { Link } from 'react-router-dom';
import { getUserRole, logout } from '../utils/auth';

const Navbar = () => {
  const role = getUserRole();

  return (
    <nav className="navbar">
      <ul>
        {role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
        {role === 'cocina' && <li><Link to="/cocina">Cocina</Link></li>}
        {role === 'finanzas' && <li><Link to="/finanzas">Finanzas</Link></li>}
        <li><button onClick={logout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
