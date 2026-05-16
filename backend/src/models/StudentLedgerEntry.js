const mongoose = require('mongoose');
const { LEDGER_ENTRY_TYPE } = require('../config/constants');

// Ledger entries are APPEND-ONLY. Never update or delete.
const studentLedgerEntrySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  entryDate: { type: Date, default: Date.now },
  entryType: { 
    type: String, 
    enum: Object.values(LEDGER_ENTRY_TYPE), 
    required: true 
  },
  debitAmount: { type: Number, default: 0 }, // amount owed (fee charged)
  creditAmount: { type: Number, default: 0 }, // amount paid
  balanceAfterEntry: { type: Number, required: true }, // running balance (+ = due, - = advance)
  feeHeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeHead' },
  feeHeadName: { type: String }, // snapshot
  sourceType: { type: String }, // 'fee_assignment', 'receipt', 'cancellation', 'carryforward', etc.
  sourceId: { type: mongoose.Schema.Types.ObjectId }, // ref to source record
  receiptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Receipt' },
  receiptNumber: { type: String },
  paymentModeId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMode' },
  paymentModeName: { type: String },
  particulars: { type: String }, // human-readable description
  remarks: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isMigrated: { type: Boolean, default: false },
  migrationBatchId: { type: mongoose.Schema.Types.ObjectId, ref: 'MigrationBatch' },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
}, { timestamps: true });

// Ledger is the accounting source of truth
studentLedgerEntrySchema.index({ studentId: 1, academicYearId: 1, entryDate: 1 });

module.exports = mongoose.model('StudentLedgerEntry', studentLedgerEntrySchema);
