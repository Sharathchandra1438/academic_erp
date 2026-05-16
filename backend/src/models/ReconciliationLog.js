const mongoose = require('mongoose');

const reconciliationLogSchema = new mongoose.Schema({
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentTransaction' },
  receiptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Receipt' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  originalMode: { type: String },
  correctedMode: { type: String },
  amount: { type: Number },
  status: { type: String, enum: ['Reconciled', 'Pending', 'Disputed', 'Mode Corrected'] },
  gatewaySettlement: { type: Number },
  gatewayCharge: { type: Number },
  bankStatement: { type: String },
  reconcileDate: { type: Date },
  reconciledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
}, { timestamps: true });

module.exports = mongoose.model('ReconciliationLog', reconciliationLogSchema);
