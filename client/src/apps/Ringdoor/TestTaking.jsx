import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestTaking = ({ testId, onClose }) => {
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Enter fullscreen
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => console.log(err));
    }

    // Disable escape key warning (browser handles this, but we can try to block navigation)
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function() {
        window.history.pushState(null, "", window.location.href);
    };

    fetchTest();

    return () => {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => console.log(err));
        }
        window.onpopstate = null;
    }
  }, []);

  const fetchTest = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:3001/api/ringdoor/tests/${testId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    setTest(res.data);
  };

  const handleAnswer = (qId, val) => {
    setAnswers({ ...answers, [qId]: val });
  };

  const submitTest = async () => {
    const confirmSubmit = window.confirm("Are you sure you want to submit? You cannot go back.");
    if (!confirmSubmit) return;

    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:3001/api/ringdoor/submit', {
        test_id: testId,
        answers
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    setResult(res.data);
    setSubmitted(true);
  };

  if (!test) return <div className="loading-container"><div className="loading-wheel"></div></div>;

  if (submitted) {
    return (
        <div className="app-fullscreen" style={{justifyContent:'center', alignItems:'center'}}>
            <div className="window" style={{width: '300px', textAlign:'center'}}>
                <div className="title-bar">Test Complete</div>
                <div className="window-content">
                    <h3>Score: {result.score} / {result.total}</h3>
                    <button onClick={onClose}>Exit Secure Mode</button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="app-fullscreen">
        <div className="app-toolbar">
            <span className="testisd-logo">Ringdoor Secure Browser</span>
            <span style={{flex: 1, textAlign: 'center', fontWeight: 'bold'}}>{test.title}</span>
            <span>LOCKED</span>
        </div>
        <div style={{flex: 1, overflow: 'auto', padding: '20px', background: '#f5f5f5'}}>
            {test.Questions.map((q, i) => (
                <div key={q.id} className="window">
                    <div className="title-bar">Question {i+1}</div>
                    <div className="window-content">
                        <p style={{fontSize:'16px', fontWeight:'bold'}}>{q.question_text}</p>
                        <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                            {q.options.map((opt, oi) => (
                                <label key={oi}>
                                    <input
                                        type="radio"
                                        name={`q-${q.id}`}
                                        value={opt}
                                        onChange={() => handleAnswer(q.id, opt)}
                                        checked={answers[q.id] === opt}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
            <div style={{textAlign:'center', paddingBottom: '50px'}}>
                <button onClick={submitTest} style={{fontSize:'18px', padding:'10px 30px'}}>Submit Test</button>
            </div>
        </div>
    </div>
  );
};

export default TestTaking;
