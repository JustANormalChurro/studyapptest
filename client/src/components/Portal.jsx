import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Portal = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openApp = (appRoute) => {
    navigate(appRoute);
  };

  return (
    <div className="portal-container">
      <header className="portal-header">
        <div style={{ fontWeight: 'bold' }}>TestISD Portal - {user?.name} ({user?.role})</div>
        <button onClick={handleLogout}>Log Out</button>
      </header>

      <div className="portal-body">
        <div className="app-item" onClick={() => openApp('/flash')}>
          <div className="app-icon" style={{ color: 'orange' }}>⚡</div>
          <span>Flash</span>
        </div>

        <div className="app-item" onClick={() => openApp('/ringdoor')}>
          <div className="app-icon" style={{ color: 'red' }}>🔒</div>
          <span>Ringdoor</span>
        </div>

        <div className="app-item" onClick={() => openApp('/aura')}>
          <div className="app-icon" style={{ color: 'purple' }}>👁️</div>
          <span>AuraAttendance</span>
        </div>

        <div className="app-item" onClick={() => openApp('/about')}>
          <div className="app-icon" style={{ color: 'blue' }}>ℹ️</div>
          <span>TestISD</span>
        </div>

        {user?.role === 'teacher' && (
          <div className="app-item" onClick={() => openApp('/admin')}>
            <div className="app-icon" style={{ color: 'black' }}>🔑</div>
            <span>Admin DB</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portal;
