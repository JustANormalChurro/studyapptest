import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const TeacherFlash = () => {
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', due_date: '' });
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/flash/assignments', {
        headers: { Authorization: `Bearer ${token}` }
    });
    setAssignments(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post('/api/flash/assignments', newAssignment, {
        headers: { Authorization: `Bearer ${token}` }
    });
    setNewAssignment({ title: '', description: '', due_date: '' });
    fetchAssignments();
  };

  const viewSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);
    const token = localStorage.getItem('token');
    const res = await axios.get(`/api/flash/submissions/${assignment.id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    setSubmissions(res.data);
  };

  return (
    <div>
      <div className="window">
        <div className="title-bar">Create Assignment</div>
        <div className="window-content">
          <form onSubmit={handleCreate} style={{display:'flex', flexDirection:'column', gap:'5px'}}>
            <input placeholder="Title" value={newAssignment.title} onChange={e=>setNewAssignment({...newAssignment, title:e.target.value})} required />
            <textarea placeholder="Description" value={newAssignment.description} onChange={e=>setNewAssignment({...newAssignment, description:e.target.value})} />
            <input type="date" value={newAssignment.due_date} onChange={e=>setNewAssignment({...newAssignment, due_date:e.target.value})} />
            <button type="submit">Post Assignment</button>
          </form>
        </div>
      </div>

      <div className="window">
        <div className="title-bar">Assignments List</div>
        <div className="window-content">
          <table>
            <thead>
              <tr><th>Title</th><th>Due</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{new Date(a.due_date).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => viewSubmissions(a)}>View Submissions</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAssignment && (
        <div className="window">
          <div className="title-bar">Submissions for: {selectedAssignment.title} <button onClick={() => setSelectedAssignment(null)} style={{float:'right'}}>X</button></div>
          <div className="window-content">
            {submissions.length === 0 ? <p>No submissions yet.</p> : (
              <table>
                <thead><tr><th>Student</th><th>Content</th><th>Status</th></tr></thead>
                <tbody>
                  {submissions.map(s => (
                    <tr key={s.id}>
                      <td>{s.User.name}</td>
                      <td>{s.content}</td>
                      <td>{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherFlash;
