import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SecretDBViewer = () => {
  const [tables, setTables] = useState([]);
  const [currentTable, setCurrentTable] = useState('');
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3001/api/admin/tables', {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => setTables(res.data));
  }, []);

  const loadTable = async (table) => {
    setCurrentTable(table);
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:3001/api/admin/db/${table}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    setData(res.data);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="title-bar" style={{ marginBottom: '20px', background: 'black' }}>
        <span>ADMIN DATABASE VIEWER - TOP SECRET</span>
        <button onClick={() => navigate('/portal')} style={{ background: 'red', color: 'white', fontWeight: 'bold' }}>X</button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div className="window" style={{ width: '200px' }}>
            <div className="title-bar">Tables</div>
            <div className="window-content">
                {tables.map(t => (
                    <button key={t} onClick={() => loadTable(t)} style={{display:'block', width:'100%', marginBottom:'5px'}}>
                        {t}
                    </button>
                ))}
            </div>
        </div>

        <div className="window" style={{ flex: 1, overflow: 'auto' }}>
            <div className="title-bar">Data: {currentTable}</div>
            <div className="window-content">
                {data.length === 0 ? <p>No data or select a table.</p> : (
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(data[0]).map(k => <th key={k}>{k}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, i) => (
                                <tr key={i}>
                                    {Object.values(row).map((val, j) => (
                                        <td key={j}>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SecretDBViewer;
