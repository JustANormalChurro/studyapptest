import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Portal from './components/Portal';
import { AuthProvider, useAuth } from './context/AuthContext';
import FlashApp from './apps/Flash/FlashApp';
import RingdoorApp from './apps/Ringdoor/RingdoorApp';
import AuraApp from './apps/AuraAttendance/AuraApp';
import AboutApp from './apps/TestISD/AboutApp';
import SecretDBViewer from './apps/Admin/SecretDBViewer';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-container"><div className="loading-wheel"></div></div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/portal" element={<ProtectedRoute><Portal /></ProtectedRoute>} />
      <Route path="/flash/*" element={<ProtectedRoute><FlashApp /></ProtectedRoute>} />
      <Route path="/ringdoor/*" element={<ProtectedRoute><RingdoorApp /></ProtectedRoute>} />
      <Route path="/aura/*" element={<ProtectedRoute><AuraApp /></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute><AboutApp /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><SecretDBViewer /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/portal" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
