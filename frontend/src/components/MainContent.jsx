import React from 'react';
import './MainContent.css';

function MainContent({ userName = 'nombre del usuario' }) {
  return (
    <main className="main-content">
      <div className="welcome-section">
        <h1>Bienvenido, <span className="username">*{userName}*</span></h1>
      </div>
    </main>
  );
}

export default MainContent;
