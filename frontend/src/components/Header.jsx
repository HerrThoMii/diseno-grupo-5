import React, { useState } from 'react';
import { Menu, User, ChevronDown, UserCircle } from 'lucide-react';
import './Header.css';

function Header({ onLogout = () => {}, onMenuToggle = () => {}, userName = 'Usuario' }) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Logo UTN en color negro
  const utnLogoUrl = 'https://www.utn.edu.ar/images/04-LOGO-UTN-WEB-NEG-BAJADA.png';

  const handleOptionClick = (option) => {
    setShowDropdown(false);
    // Aquí irían las navegaciones o acciones según la opción
    console.log('Opción seleccionada:', option);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" title="Menú" onClick={onMenuToggle}>
          <Menu size={24} />
        </button>
        <img src={utnLogoUrl} alt="UTN Logo" className="logo logo-black" />
      </div>
      <div className="header-right">
        <div className="user-card" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="user-avatar">
            <User size={20} />
          </div>
          <span className="user-name">{userName}</span>
          <ChevronDown size={18} className={`user-chevron ${showDropdown ? 'rotated' : ''}`} />
          
          {showDropdown && (
            <div className="user-dropdown">
              <button onClick={(e) => { e.stopPropagation(); handleOptionClick('perfil'); }} className="dropdown-item">
                <UserCircle size={16} />
                <span>Ver perfil</span>
              </button>
              <div className="dropdown-divider"></div>
              <button onClick={(e) => { e.stopPropagation(); onLogout(); }} className="dropdown-item logout-item">
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
