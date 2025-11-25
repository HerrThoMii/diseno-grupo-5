import React from 'react';
import { Menu, Bell, Sun, LogOut } from 'lucide-react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" title="Menú">
          <Menu size={24} />
        </button>
        <span className="logo">LOGO</span>
      </div>
      <div className="header-right">
        <button className="header-icon" title="Notificaciones">
          <Bell size={20} />
        </button>
        <button className="header-icon" title="Tema">
          <Sun size={20} />
        </button>
        <button className="header-icon" title="Cerrar sesión">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export default Header;
