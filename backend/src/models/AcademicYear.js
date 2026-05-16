const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true }, // e.g., "2026-27"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: false },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

academicYearSchema.index({ organisationId: 1, label: 1 }, { unique: true });

module.exports = mongoose.model('AcademicYear', academicYearSchema);
