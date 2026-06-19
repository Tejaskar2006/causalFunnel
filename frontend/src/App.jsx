import React, { useEffect, useState } from 'react';
import './index.css';

function App() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionEvents, setSessionEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
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

  const openSessionJourney = (sessionId) => {
    setSelectedSession(sessionId);
    setLoadingEvents(true);
    fetch(`${API_URL}/sessions/${sessionId}/events`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSessionEvents(data.data);
        }
        setLoadingEvents(false);
      })
      .catch(err => {
        console.error('Failed to fetch session events:', err);
        setLoadingEvents(false);
      });
  };

  const closeJourney = () => {
    setSelectedSession(null);
    setSessionEvents([]);
  };

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
              <div className="session-card" key={session.session_id} onClick={() => openSessionJourney(session.session_id)}>
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

      {selectedSession && (
        <div className="modal-overlay" onClick={closeJourney}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeJourney}>&times;</button>
            <h2 className="modal-title">User Journey</h2>
            <p className="modal-subtitle">Session: <span className="session-id">{selectedSession}</span></p>
            
            {loadingEvents ? (
              <div className="loader">Loading timeline...</div>
            ) : (
              <div className="timeline">
                {sessionEvents.length === 0 && <p className="no-data">No events found for this session.</p>}
                {sessionEvents.map((event, index) => (
                  <div className="timeline-item" key={event._id || index}>
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className={`event-badge ${event.event_type}`}>{event.event_type}</span>
                        <span className="event-time">{new Date(event.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="event-details">
                        <div className="detail-row">
                          <span className="detail-label">URL:</span>
                          <span className="detail-value" title={event.url}>{event.url}</span>
                        </div>
                        {event.event_type === 'click' && (
                          <div className="detail-row">
                            <span className="detail-label">Coordinates:</span>
                            <span className="detail-value">X: {event.x}, Y: {event.y}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
