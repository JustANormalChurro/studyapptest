import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuraApp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);

  // Teacher inputs
  const [selectedStudent, setSelectedStudent] = useState('');
  const [attDate, setAttDate] = useState('');
  const [attStatus, setAttStatus] = useState('present');
  const [gradeSubject, setGradeSubject] = useState('');
  const [gradeScore, setGradeScore] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchData();
    if (user.role === 'teacher') fetchStudents();
  }, [user]);

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/users/students', { headers: { Authorization: `Bearer ${token}` } });
    setStudents(res.data);
    if (res.data.length > 0) setSelectedStudent(res.data[0].id);
  };

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const attRes = await axios.get('/api/aura/attendance', { headers: { Authorization: `Bearer ${token}` } });
    setAttendance(attRes.data);
    const grRes = await axios.get('/api/aura/grades', { headers: { Authorization: `Bearer ${token}` } });
    setGrades(grRes.data);
  };

  const submitAttendance = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post('/api/aura/attendance', {
        student_id: selectedStudent, date: attDate, status: attStatus
    }, { headers: { Authorization: `Bearer ${token}` } });
    setMsg('Attendance Recorded');
    fetchData();
  };

  const submitGrade = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post('/api/aura/grades', {
        student_id: selectedStudent, subject: gradeSubject, score: gradeScore
    }, { headers: { Authorization: `Bearer ${token}` } });
    setMsg('Grade Recorded');
    fetchData();
  };

  return (
    <div style={{ padding: '20px' }}>
        <div className="title-bar" style={{ marginBottom: '20px', background: 'linear-gradient(to right, #4b0082, #8a2be2)' }}>
            <span>AuraAttendance - Grades & Attendance</span>
            <button onClick={() => navigate('/portal')} style={{ background: 'red', color: 'white', fontWeight: 'bold' }}>X</button>
        </div>

        {user.role === 'teacher' && (
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div className="window" style={{ flex: 1 }}>
                    <div className="title-bar">Record Attendance</div>
                    <div className="window-content">
                        <form onSubmit={submitAttendance} style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                            <label>Student:</label>
                            <select value={selectedStudent} onChange={e=>setSelectedStudent(e.target.value)}>
                                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            <label>Date:</label>
                            <input type="date" value={attDate} onChange={e=>setAttDate(e.target.value)} required />
                            <label>Status:</label>
                            <select value={attStatus} onChange={e=>setAttStatus(e.target.value)}>
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="tardy">Tardy</option>
                            </select>
                            <button type="submit">Save</button>
                        </form>
                    </div>
                </div>
                <div className="window" style={{ flex: 1 }}>
                    <div className="title-bar">Record Grade</div>
                    <div className="window-content">
                        <form onSubmit={submitGrade} style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                            <label>Student:</label>
                            <select value={selectedStudent} onChange={e=>setSelectedStudent(e.target.value)}>
                                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            <label>Subject:</label>
                            <input type="text" value={gradeSubject} onChange={e=>setGradeSubject(e.target.value)} required />
                            <label>Score:</label>
                            <input type="text" value={gradeScore} onChange={e=>setGradeScore(e.target.value)} required />
                            <button type="submit">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        )}
        {msg && <p style={{color: 'green', fontWeight:'bold'}}>{msg}</p>}

        <div className="window">
            <div className="title-bar">Attendance Records</div>
            <div className="window-content">
                <table>
                    <thead><tr><th>Student</th><th>Date</th><th>Status</th></tr></thead>
                    <tbody>
                        {attendance.map(a => (
                            <tr key={a.id}>
                                <td>{a.User?.name}</td>
                                <td>{a.date}</td>
                                <td>{a.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="window">
            <div className="title-bar">Grades</div>
            <div className="window-content">
                <table>
                    <thead><tr><th>Student</th><th>Subject</th><th>Score</th></tr></thead>
                    <tbody>
                        {grades.map(g => (
                            <tr key={g.id}>
                                <td>{g.User?.name}</td>
                                <td>{g.subject}</td>
                                <td>{g.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default AuraApp;
