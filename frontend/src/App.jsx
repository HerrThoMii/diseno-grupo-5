import './App.css'
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import HomePage from './pages/HomePage'
import TrabajosPage from './pages/TrabajosPage'
import MemoriaPage from './pages/MemoriaPage'
import RegistrosPage from './pages/RegistrosPage'
import GrupoPage from './pages/GrupoPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Dashboard userName="nombre del usuario" />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/trabajos" element={<TrabajosPage />} />
          <Route path="/memoria" element={<MemoriaPage />} />
          <Route path="/registros" element={<RegistrosPage />} />
          <Route path="/grupo" element={<GrupoPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
