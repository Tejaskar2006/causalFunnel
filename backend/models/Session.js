const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  session_id: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  event_count: { type: Number, default: 0 }
});

// Update timestamp on save
sessionSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Session', sessionSchema);
