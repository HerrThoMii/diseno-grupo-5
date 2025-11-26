import React from 'react';
import { FileText, BookOpen, Award, Users } from 'lucide-react';
import './Sidebar.css';

function Sidebar({ onNavigate, activeSection }) {
  const menuItems = [
    { id: 'memoria', label: 'Crear memoria anual', icon: FileText },
    { id: 'trabajos', label: 'Trabajos realizados y publicados', icon: BookOpen },
    { id: 'registros', label: 'Trabajos, registros y patentes', icon: Award },
    { id: 'grupo', label: 'Agregar grupo', icon: Users },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="sidebar-icon">
                <IconComponent size={18} />
              </span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
