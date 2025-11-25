import React, { useState } from 'react';
import './Dashboard.css';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import Footer from './Footer';

function Dashboard({ userName = 'nombre del usuario' }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="dashboard-container">
        {sidebarOpen && <Sidebar />}
        <MainContent userName={userName} />
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
