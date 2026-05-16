const mongoose = require('mongoose');

const dailyClosingSchema = new mongoose.Schema({
  closingDate: { type: Date, required: true },
  closedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalCollected: { type: Number, default: 0 },
  cashCollection: { type: Number, default: 0 },
  bankCollection: { type: Number, default: 0 },
  onlineCollection: { type: Number, default: 0 },
  receiptCount: { type: Number, default: 0 },
  cancellationCount: { type: Number, default: 0 },
  paymentModeSummary: [{
    paymentModeName: String,
    amount: Number,
    count: Number,
  }],
  status: { type: String, enum: ['Draft', 'Closed', 'Approved'], default: 'Draft' },
  notes: { type: String },
  isLocked: { type: Boolean, default: false }, // locked after closing — no backdated changes
  lockedAt: { type: Date },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
}, { timestamps: true });

dailyClosingSchema.index({ organisationId: 1, closingDate: 1 }, { unique: true });

module.exports = mongoose.model('DailyClosing', dailyClosingSchema);
