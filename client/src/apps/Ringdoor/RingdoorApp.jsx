import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TeacherRingdoor from './TeacherRingdoor';
import TestTaking from './TestTaking';

const RingdoorApp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [activeTestId, setActiveTestId] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/ringdoor/tests', {
        headers: { Authorization: `Bearer ${token}` }
    });
    setTests(res.data);
  };

  const startTest = (test) => {
    if (test.password) {
        const input = prompt("Enter test password:");
        if (input !== test.password) {
            alert("Incorrect password.");
            return;
        }
    }
    setActiveTestId(test.id);
  };

  if (activeTestId) {
    return <TestTaking testId={activeTestId} onClose={() => setActiveTestId(null)} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div className="title-bar" style={{ marginBottom: '20px', background: 'linear-gradient(to right, #800000, #d01010)' }}>
        <span>Ringdoor - Secure Testing</span>
        <button onClick={() => navigate('/portal')} style={{ background: 'white', color: 'black', fontWeight: 'bold' }}>X</button>
      </div>

      {user.role === 'teacher' && <TeacherRingdoor />}

      <div className="window" style={{ marginTop: '20px' }}>
        <div className="title-bar">Available Tests</div>
        <div className="window-content">
          <table>
            <thead><tr><th>Title</th><th>Action</th></tr></thead>
            <tbody>
              {tests.map(t => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>
                    {user.role === 'student' ? (
                        <button onClick={() => startTest(t)}>Start Test</button>
                    ) : (
                        <span>(Teacher View Only)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RingdoorApp;
