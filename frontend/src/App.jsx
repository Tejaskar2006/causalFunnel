import React, { useEffect, useState } from 'react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('sessions');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionEvents, setSessionEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Heatmap state
  const [urls, setUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [heatmapData, setHeatmapData] = useState([]);
  const [loadingHeatmap, setLoadingHeatmap] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (activeTab === 'sessions') {
      setLoading(true);
      fetch(`${API_URL}/sessions`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setSessions(data.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch sessions:', err);
          setLoading(false);
        });
    } else if (activeTab === 'heatmap') {
      fetch(`${API_URL}/heatmap/urls`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUrls(data.data);
            if (data.data.length > 0 && !selectedUrl) {
              setSelectedUrl(data.data[0]);
            }
          }
        });
    }
  }, [API_URL, activeTab]);

  useEffect(() => {
    if (activeTab === 'heatmap' && selectedUrl) {
      setLoadingHeatmap(true);
      fetch(`${API_URL}/heatmap?url=${encodeURIComponent(selectedUrl)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setHeatmapData(data.data);
          setLoadingHeatmap(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingHeatmap(false);
        });
    }
  }, [API_URL, activeTab, selectedUrl]);

  const openSessionJourney = (sessionId) => {
    setSelectedSession(sessionId);
    setLoadingEvents(true);
    fetch(`${API_URL}/sessions/${sessionId}/events`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setSessionEvents(data.data);
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
        <nav className="tabs">
          <button
            className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            Sessions
          </button>
          <button
            className={`tab ${activeTab === 'heatmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('heatmap')}
          >
            Heatmap
          </button>
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'sessions' && (
          <>
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
          </>
        )}

        {activeTab === 'heatmap' && (
          <div className="heatmap-container">
            <h1 className="title">Click Heatmap</h1>
            <div className="heatmap-controls">
              <label>Select Page URL:</label>
              <select
                value={selectedUrl}
                onChange={e => setSelectedUrl(e.target.value)}
                className="url-select"
              >
                {urls.length === 0 && <option value="">No tracked URLs yet</option>}
                {urls.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            {loadingHeatmap ? (
              <div className="loader">Loading heatmap data...</div>
            ) : (
              <div className="heatmap-board">
                {heatmapData.length === 0 && <p className="no-data">No clicks recorded for this URL.</p>}
                {heatmapData.map((click, i) => (
                  <div
                    key={click._id || i}
                    className="heatmap-dot"
                    style={{ left: click.x, top: click.y }}
                    title={`Click at X:${click.x}, Y:${click.y}`}
                  ></div>
                ))}
                {/* Background dummy browser frame for visualization */}
                <div className="browser-frame">
                  <div className="browser-header">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="browser-body">
                    {/* <p className="browser-placeholder">Visualizing clicks relative to the top-left corner of the window. Note that variations in window sizes might offset absolute coordinates in a real environment.</p> */}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* User Journey Modal */}
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
