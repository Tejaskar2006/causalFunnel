import React, { useEffect, useState } from 'react';
import './index.css';

function App() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetch(`${API_URL}/sessions`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSessions(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch sessions:', err);
        setLoading(false);
      });
  }, [API_URL]);

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="logo">CausalFunnel Analytics</div>
      </header>
      <main className="main-content">
        <h1 className="title">Active Sessions</h1>
        {loading ? (
          <div className="loader">Loading sessions...</div>
        ) : (
          <div className="sessions-grid">
            {sessions.length === 0 && <p className="no-data">No sessions tracked yet. Open the demo page to generate some!</p>}
            {sessions.map(session => (
              <div className="session-card" key={session.session_id}>
                <div className="session-header">
                  <span className="session-id">{session.session_id}</span>
                </div>
                <div className="session-stats">
                  <div className="stat">
                    <span className="stat-value">{session.event_count}</span>
                    <span className="stat-label">Total Events</span>
                  </div>
                  <div className="stat" style={{ alignItems: 'flex-end' }}>
                    <span className="stat-label">Last Active</span>
                    <span className="stat-date">{new Date(session.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
