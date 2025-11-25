import React from 'react';
import { FileText, BookOpen, Award, Users } from 'lucide-react';
import './Sidebar.css';

function Sidebar() {
  const menuItems = [
    { id: 1, label: 'Crear memoria anual', icon: FileText },
    { id: 2, label: 'Trabajos realizados y publicados', icon: BookOpen },
    { id: 3, label: 'Trabajos, registros y patentes', icon: Award },
    { id: 4, label: 'Agregar grupo', icon: Users },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button key={item.id} className="sidebar-item">
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
