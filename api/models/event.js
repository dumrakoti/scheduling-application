const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, require: true },
  start: { type: String, require: true },
  end: { type: String },
  description: { type: String },
  participants: { type: String },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() }
});

module.exports = mongoose.model('Event', eventSchema);