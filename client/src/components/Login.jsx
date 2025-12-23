import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teacherCode, setTeacherCode] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password, teacherCode || undefined);
    if (res.success) {
      navigate('/portal');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="login-container">
      <div className="window login-box">
        <div className="title-bar">
          <span>TestISD Login</span>
          <span>X</span>
        </div>
        <div className="window-content">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <label>Teacher Code (Optional):</label>
            <input type="text" value={teacherCode} onChange={(e) => setTeacherCode(e.target.value)} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button type="submit">Log In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
