import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentFlash = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:3001/api/flash/assignments', {
        headers: { Authorization: `Bearer ${token}` }
    });
    setAssignments(res.data);
  };

  const openAssignment = (a) => {
    setSelectedAssignment(a);
    setSubmissionContent('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3001/api/flash/submissions', {
        assignment_id: selectedAssignment.id,
        content: submissionContent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Submitted successfully!');
      setTimeout(() => {
        setSelectedAssignment(null);
        setMessage('');
      }, 1500);
    } catch (err) {
      setMessage('Error submitting.');
    }
  };

  return (
    <div>
      <div className="window">
        <div className="title-bar">My Assignments</div>
        <div className="window-content">
          <table>
            <thead><tr><th>Title</th><th>Teacher</th><th>Due</th><th>Action</th></tr></thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.User?.name}</td>
                  <td>{new Date(a.due_date).toLocaleDateString()}</td>
                  <td><button onClick={() => openAssignment(a)}>View/Submit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAssignment && (
        <div className="window">
          <div className="title-bar">Submit: {selectedAssignment.title} <button onClick={() => setSelectedAssignment(null)} style={{float:'right'}}>X</button></div>
          <div className="window-content">
            <p><strong>Description:</strong> {selectedAssignment.description}</p>
            <form onSubmit={handleSubmit}>
              <textarea
                rows="5"
                style={{width: '100%'}}
                placeholder="Type your answer here..."
                value={submissionContent}
                onChange={e => setSubmissionContent(e.target.value)}
                required
              ></textarea>
              <br />
              <button type="submit" style={{marginTop:'10px'}}>Submit Work</button>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFlash;
