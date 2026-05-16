const mongoose = require('mongoose');

const carryforwardEntrySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  fromAcademicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  toAcademicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  promotionBatchId: { type: mongoose.Schema.Types.ObjectId, ref: 'PromotionBatch' },
  type: { type: String, enum: ['Due', 'Advance'], required: true },
  amount: { type: Number, required: true },
  feeHeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeHead' },
  feeHeadName: { type: String },
  sourceReceiptIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Receipt' }],
  ledgerEntryId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentLedgerEntry' },
  remarks: { type: String },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('CarryforwardEntry', carryforwardEntrySchema);
