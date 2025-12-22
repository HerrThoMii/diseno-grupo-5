import React, { useState, useEffect } from 'react';
import MainContent from '../components/MainContent';


function HomePage() {
  const [nombre, setNombre] = useState('Usuario');

  useEffect(() => {
    const loadUserName = () => {
      const userData = localStorage.getItem('user');
      const userName = userData ? JSON.parse(userData).nombre : 'Usuario';
      setNombre(userName);
    };

    // Cargar nombre inicial
    loadUserName();

    // Escuchar cambios en localStorage
    window.addEventListener('storage', loadUserName);
    
    // También crear un evento personalizado para cambios locales
    const handleLocalUpdate = () => loadUserName();
    window.addEventListener('userDataUpdated', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', loadUserName);
      window.removeEventListener('userDataUpdated', handleLocalUpdate);
    };
  }, []);

  return <MainContent userName={nombre} />;
}

export default HomePage;
