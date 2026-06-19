const Event = require('../models/Event');
const Session = require('../models/Session');

exports.trackEvent = async (req, res) => {
  try {
    const { session_id, event_type, url, timestamp, x, y } = req.body;

    if (!session_id || !event_type || !url) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Create the Event
    const newEvent = new Event({
      session_id,
      event_type,
      url,
      timestamp: timestamp || new Date(),
      x,
      y
    });

    await newEvent.save();

    // 2. Upsert the Session and increment event count
    await Session.findOneAndUpdate(
      { session_id },
      { 
        $setOnInsert: { created_at: new Date() },
        $set: { updated_at: new Date() },
        $inc: { event_count: 1 }
      },
      { upsert: true, returnDocument: 'after' }
    );

    res.status(201).json({ success: true, message: 'Event tracked' });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getClickUrls = async (req, res) => {
  try {
    const urls = await Event.distinct('url', { event_type: 'click' });
    res.status(200).json({ success: true, data: urls });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getHeatmapData = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    const clicks = await Event.find({ url, event_type: 'click' }, 'x y');
    res.status(200).json({ success: true, data: clicks });
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
