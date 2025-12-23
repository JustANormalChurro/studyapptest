import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutApp = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <div className="title-bar" style={{ marginBottom: '20px', background: 'linear-gradient(to right, #000080, #0000ff)' }}>
        <span>About TestISD</span>
        <button onClick={() => navigate('/portal')} style={{ background: 'red', color: 'white', fontWeight: 'bold' }}>X</button>
      </div>

      <div className="window">
        <div className="title-bar">History of TestISD</div>
        <div className="window-content">
          <h3>TestISD: A Legacy of Digital Education</h3>
          <p>
            Established in the early 2000s, TestISD set out to revolutionize the digital classroom.
            Before the era of sleek, rounded corners and minimalist designs, TestISD provided a robust,
            utilitarian interface for students and teachers alike.
          </p>
          <p>
            Our mission was simple: Connect the classroom to the web.
            We pioneered the "Ringdoor" secure testing browser and the "Flash" assignment system.
          </p>
          <p>
            Thank you for using TestISD.
          </p>
          <hr />
          <p style={{fontStyle: 'italic', fontSize: '10px'}}>v1.0.4 (Build 2005)</p>
        </div>
      </div>
    </div>
  );
};

export default AboutApp;
