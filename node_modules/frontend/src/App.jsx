import './App.css'
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login'
import Register from './components/register'
import Dashboard from './components/Dashboard'
import HomePage from './pages/HomePage'
import TrabajosPage from './pages/TrabajosPage'
import MemoriaPage from './pages/MemoriaPage'
import RegistrosPage from './pages/RegistrosPage'
import GrupoPage from './pages/GrupoPage'
import AcercaDePage from './pages/AcercaDePage'
import { getUser } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('nombre del usuario');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Cargar datos del usuario desde localStorage al iniciar
    const user = getUser();
    if (user) {
      setUserData(user);
      setUserName(user.nombre || user.correo?.split('@')[0] || 'Usuario');
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (name) => {
    const user = getUser();
    setUserData(user);
    setUserName(name || user?.nombre || 'nombre del usuario');
    setIsAuthenticated(true);
  };

  const handleRegister = (name) => {
    const user = getUser();
    setUserData(user);
    setUserName(name || user?.nombre || 'nombre del usuario');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('nombre del usuario');
    setUserData(null);
  };

  const handleUpdateUserData = (newUserData) => {
    setUserData(newUserData);
    setUserName(newUserData.nombre || newUserData.correo?.split('@')[0] || 'Usuario');
    // Actualizar también en localStorage
    const user = getUser();
    if (user) {
      const updatedUser = { ...user, ...newUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // Disparar evento personalizado para notificar a otros componentes
      window.dispatchEvent(new Event('userDataUpdated'));
    }
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
        <Route element={<Dashboard userName={userName} userData={userData} onLogout={handleLogout} onUpdateUserData={handleUpdateUserData} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/trabajos" element={<TrabajosPage />} />
          <Route path="/memoria" element={<MemoriaPage />} />
          <Route path="/registros" element={<RegistrosPage />} />
          <Route path="/grupo" element={<GrupoPage />} />
          <Route path="/acerca-de" element={<AcercaDePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
