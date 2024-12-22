import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth';

const PrivateRoute = ({ role, children }) => {
  const userRole = getUserRole();

  if (!userRole) return <Navigate to="/" />;
  if (role !== userRole && userRole !== 'admin') return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
