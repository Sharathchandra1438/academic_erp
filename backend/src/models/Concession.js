const mongoose = require('mongoose');

const concessionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  feeHeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeHead' },
  feeHeadName: { type: String },
  concessionType: { type: String, enum: ['Amount', 'Percentage'] },
  concessionAmount: { type: Number },
  concessionPercentage: { type: Number },
  effectiveAmount: { type: Number }, // actual amount reduced
  reason: { type: String, required: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  rejectionReason: { type: String },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Concession', concessionSchema);
