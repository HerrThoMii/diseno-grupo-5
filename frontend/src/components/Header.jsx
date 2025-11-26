import React from 'react';
import { Menu, Bell, Sun, LogOut } from 'lucide-react';
import './Header.css';

function Header({ onLogout = () => {}, onMenuToggle = () => {} }) {
  // Logo UTN en color negro
  const utnLogoUrl = 'https://www.utn.edu.ar/images/04-LOGO-UTN-WEB-NEG-BAJADA.png';

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" title="Menú" onClick={onMenuToggle}>
          <Menu size={24} />
        </button>
        <img src={utnLogoUrl} alt="UTN Logo" className="logo logo-black" />
      </div>
      <div className="header-right">
        <button className="header-icon" title="Notificaciones">
          <Bell size={20} />
        </button>
        <button className="header-icon" title="Tema">
          <Sun size={20} />
        </button>
        <button className="header-icon" title="Cerrar sesión" onClick={onLogout}>
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export default Header;
