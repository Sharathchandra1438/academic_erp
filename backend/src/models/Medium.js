const mongoose = require('mongoose');

const mediumSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // English, Telugu, Hindi
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Medium', mediumSchema);
