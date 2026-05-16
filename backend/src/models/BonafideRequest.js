const mongoose = require('mongoose');

const bonafideRequestSchema = new mongoose.Schema({
  requestNumber: { type: String },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  purpose: { type: String, required: true }, // Bank account, Passport, Scholarship, etc.
  addressedTo: { type: String },
  requestedBy: { type: String, enum: ['Student', 'Parent', 'Staff'], default: 'Parent' },
  status: { type: String, enum: ['Requested', 'Under Review', 'Approved', 'Generated', 'Rejected', 'Cancelled'], default: 'Requested' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  generatedAt: { type: Date },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  certificateFilePath: { type: String },
  rejectionReason: { type: String },
  remarks: { type: String },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
}, { timestamps: true });

module.exports = mongoose.model('BonafideRequest', bonafideRequestSchema);
