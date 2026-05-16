const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../config/constants');

const paymentTransactionSchema = new mongoose.Schema({
  transactionId: { type: String },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  receiptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Receipt' },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  amount: { type: Number, required: true },
  paymentModeId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMode', required: true },
  paymentModeName: { type: String }, // snapshot
  status: { 
    type: String, 
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.SUCCESS
  },
  referenceNumber: { type: String }, // UPI/gateway ref
  bankReference: { type: String },
  chequeNumber: { type: String },
  chequeDate: { type: Date },
  bankName: { type: String },
  chequeStatus: { 
    type: String, 
    enum: ['Pending', 'Cleared', 'Bounced', 'N/A'],
    default: 'N/A'
  },
  paymentDate: { type: Date, required: true },
  receiptDate: { type: Date },
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date },
  reconciliationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReconciliationLog' },
  branchId: { type: mongoose.Schema.Types.ObjectId },
  proofFileId: { type: String }, // file path
  gatewayCharge: { type: Number, default: 0 },
  netSettled: { type: Number },
  remarks: { type: String },
  // Correction tracking
  isCorrected: { type: Boolean, default: false },
  originalTransactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentTransaction' },
  correctionReason: { type: String },
  correctedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  // Fee head allocation
  feeHeadAllocations: [{
    feeHeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeHead' },
    feeHeadName: String,
    amount: Number,
  }],
}, { timestamps: true });

// Payment transactions MUST NOT be deleted — soft operations only
paymentTransactionSchema.index({ studentId: 1, academicYearId: 1 });
paymentTransactionSchema.index({ transactionId: 1 }, { unique: true });

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
