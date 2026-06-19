(function() {
    // Use Vite env variable if available, fallback to localhost
    const API_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:5000/api') + '/events';

    function getSessionId() {
        let sessionId = localStorage.getItem('cf_session_id');
        if (!sessionId) {
            sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('cf_session_id', sessionId);
        }
        return sessionId;
    }

    const sessionId = getSessionId();

    function sendEvent(eventType, additionalData = {}) {
        const payload = {
            session_id: sessionId,
            event_type: eventType,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            ...additionalData
        };

        // Fire and forget
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            keepalive: true
        }).catch(err => console.error('Tracking error:', err));
    }

    // Track Page View
    window.addEventListener('load', () => {
        sendEvent('page_view');
    });

    // Track Clicks
    window.addEventListener('click', (e) => {
        sendEvent('click', {
            x: e.clientX,
            y: e.clientY
        });
    });
})();
