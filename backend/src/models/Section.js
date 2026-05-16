const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // A, B, C etc.
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  capacity: { type: Number },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

sectionSchema.index({ classId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Section', sectionSchema);
