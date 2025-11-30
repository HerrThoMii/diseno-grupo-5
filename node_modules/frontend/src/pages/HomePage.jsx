import React from 'react';
import MainContent from '../components/MainContent';


function HomePage() {
  const userData = localStorage.getItem('user');
  const nombre = userData ? JSON.parse(userData).nombre : 'Usuario';
  return <MainContent userName={nombre} />;
}

export default HomePage;
