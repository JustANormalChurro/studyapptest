import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TeacherFlash from './TeacherFlash';
import StudentFlash from './StudentFlash';

const FlashApp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <div className="title-bar" style={{ marginBottom: '20px' }}>
        <span>Flash - Assignments Portal</span>
        <button onClick={() => navigate('/portal')} style={{ background: 'red', color: 'white', fontWeight: 'bold' }}>X</button>
      </div>

      {user.role === 'teacher' ? <TeacherFlash /> : <StudentFlash />}
    </div>
  );
};

export default FlashApp;
