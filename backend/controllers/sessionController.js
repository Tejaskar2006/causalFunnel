const Session = require('../models/Session');
const Event = require('../models/Event');

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().sort({ updated_at: -1 });
    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSessionEvents = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const events = await Event.find({ session_id: sessionId }).sort({ timestamp: 1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching session events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
