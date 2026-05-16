const mongoose = require('mongoose');
const { RECEIPT_STATUS } = require('../config/constants');

const applicationReceiptSchema = new mongoose.Schema({
  receiptNumber: { type: String, required: true, unique: true },
  applicationSaleId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApplicationSale' },
  candidateName: { type: String, required: true },
  parentName: { type: String, required: true },
  parentMobile: { type: String },
  interestedClass: { type: String },
  amount: { type: Number, required: true },
  paymentMode: { type: String, required: true },
  paymentReference: { type: String },
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: Object.values(RECEIPT_STATUS), 
    default: RECEIPT_STATUS.GENERATED 
  },
  cancellationReason: { type: String },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cancelledAt: { type: Date },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  receiptDate: { type: Date, default: Date.now },
}, { timestamps: true });

// Receipt numbers MUST NOT be reused — enforced by unique index
module.exports = mongoose.model('ApplicationReceipt', applicationReceiptSchema);
