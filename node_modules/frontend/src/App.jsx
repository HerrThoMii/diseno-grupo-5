import './App.css'
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login'
import Register from './components/register'
import Dashboard from './components/Dashboard'
import HomePage from './pages/HomePage'
import TrabajosPage from './pages/TrabajosPage'
import MemoriaPage from './pages/MemoriaPage'
import TrabajoRegistrosPatentes from './components/TrabajoRegistrosPatentes'
import GrupoPage from './pages/GrupoPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('nombre del usuario');

  const handleLogin = (name) => {
    setUserName(name || 'nombre del usuario');
    setIsAuthenticated(true);
  };

  const handleRegister = (name) => {
    setUserName(name || 'nombre del usuario');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('nombre del usuario');
  };

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Dashboard userName={userName} onLogout={handleLogout} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/trabajos" element={<TrabajosPage />} />
          <Route path="/memoria" element={<MemoriaPage />} />
          <Route path="/registros" element={<TrabajoRegistrosPatentes />} />
          <Route path="/grupo" element={<GrupoPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
