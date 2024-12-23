import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Cocina from './pages/Cocina';
import ClientPanel from './pages/Cliente';
import Finanzas from './pages/Finanzas';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/cocina/*" element={<Cocina/>}/>
        <Route path="/finanzas/*" element={<Finanzas />} />
        <Route path="/client/*" element={<ClientPanel/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
