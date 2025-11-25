import './App.css'
import React, { useState } from 'react';
import Login from './components/login'
import Dashboard from './components/Dashboard'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = (user) => {
    setUserName(user.nombre);
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
