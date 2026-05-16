const mongoose = require('mongoose');
const { RECEIPT_STATUS, RECEIPT_TYPE } = require('../config/constants');

const receiptSchema = new mongoose.Schema({
  receiptNumber: { type: String, required: true },
  receiptType: { 
    type: String, 
    enum: Object.values(RECEIPT_TYPE), 
    default: RECEIPT_TYPE.FEE 
  },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'CandidateApplication' },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  totalAmount: { type: Number, required: true },
  receiptDate: { type: Date, default: Date.now },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: Object.values(RECEIPT_STATUS), 
    default: RECEIPT_STATUS.GENERATED 
  },
  cancellationReason: { type: String },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cancelledAt: { type: Date },
  reversalLedgerEntryId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentLedgerEntry' },
  linkedTransactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PaymentTransaction' }],
  linkedLedgerEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentLedgerEntry' }],
  remarks: { type: String },
  // Split payment breakdown
  paymentBreakdown: [{
    paymentModeId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMode' },
    paymentModeName: String,
    amount: Number,
    reference: String,
  }],
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId },
  printCount: { type: Number, default: 0 },
  lastPrintedAt: { type: Date },
}, { timestamps: true });

// Receipt numbers MUST NEVER be reused
receiptSchema.index({ receiptNumber: 1 }, { unique: true });

module.exports = mongoose.model('Receipt', receiptSchema);
