const mongoose = require('mongoose');
const { PROMOTION_STATUS, PROMOTION_DECISION } = require('../config/constants');

const promotionDecisionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  decision: { type: String, enum: Object.values(PROMOTION_DECISION), default: PROMOTION_DECISION.PENDING },
  fromClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  fromSectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  toClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  toSectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  newRollNumber: { type: String },
  carryforwardDue: { type: Number, default: 0 },
  carryforwardAdvance: { type: Number, default: 0 },
  remarks: { type: String },
  status: { type: String, enum: ['Pending', 'Applied', 'Failed'], default: 'Pending' },
  errorMessage: { type: String },
});

const promotionBatchSchema = new mongoose.Schema({
  batchName: { type: String },
  fromAcademicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  toAcademicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  fromClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  toClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  decisions: [promotionDecisionSchema],
  status: { type: String, enum: Object.values(PROMOTION_STATUS), default: PROMOTION_STATUS.DRAFT },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submittedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  appliedAt: { type: Date },
  rollbackAt: { type: Date },
  rollbackBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rollbackReason: { type: String },
  summarySnapshot: { type: mongoose.Schema.Types.Mixed },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('PromotionBatch', promotionBatchSchema);
