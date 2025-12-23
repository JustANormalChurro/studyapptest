import React, { useState } from 'react';
import axios from 'axios';

const TeacherRingdoor = () => {
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [questions, setQuestions] = useState([{ question_text: '', options: ['', '', '', ''], correct_answer: '' }]);
  const [message, setMessage] = useState('');

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', options: ['', '', '', ''], correct_answer: '' }]);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3001/api/ringdoor/tests',
        { title, password, questions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Test Created Successfully!');
      setTitle('');
      setPassword('');
      setQuestions([{ question_text: '', options: ['', '', '', ''], correct_answer: '' }]);
    } catch (err) {
      setMessage('Error creating test.');
    }
  };

  return (
    <div className="window">
      <div className="title-bar">Create New Test</div>
      <div className="window-content">
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <label>Test Title:</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={{width: '100%'}} />

          <label>Test Password (Optional):</label>
          <input type="text" value={password} onChange={e => setPassword(e.target.value)} style={{width: '100%'}} />

          <hr />

          {questions.map((q, i) => (
            <div key={i} style={{marginBottom: '20px', border: '1px dotted #999', padding: '10px'}}>
              <label>Question {i+1}:</label>
              <input type="text" value={q.question_text} onChange={e => updateQuestion(i, 'question_text', e.target.value)} required style={{width: '100%'}} />

              <label>Options:</label>
              {q.options.map((opt, oIndex) => (
                <div key={oIndex}>
                   <input
                      type="text"
                      placeholder={`Option ${oIndex+1}`}
                      value={opt}
                      onChange={e => updateOption(i, oIndex, e.target.value)}
                      required
                      style={{width: '80%'}}
                   />
                </div>
              ))}

              <label>Correct Answer (Must match one option exactly):</label>
              <input type="text" value={q.correct_answer} onChange={e => updateQuestion(i, 'correct_answer', e.target.value)} required style={{width: '100%'}} />
            </div>
          ))}

          <button type="button" onClick={addQuestion}>+ Add Question</button>
          <button type="submit" style={{marginLeft: '10px'}}>Save Test</button>
        </form>
      </div>
    </div>
  );
};

export default TeacherRingdoor;
