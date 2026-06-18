const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  session_id: { type: String, required: true },
  event_type: { type: String, required: true, enum: ['page_view', 'click'] },
  url: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  x: { type: Number },
  y: { type: Number }
});

// Create index on session_id for faster queries later
eventSchema.index({ session_id: 1 });

module.exports = mongoose.model('Event', eventSchema);
