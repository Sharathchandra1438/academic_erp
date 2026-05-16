const mongoose = require('mongoose');
const { PAYMENT_MODE_TYPE } = require('../config/constants');

const paymentModeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // Cash, UPI, Cheque, etc.
  code: { type: String, trim: true },
  modeType: { type: String, enum: Object.values(PAYMENT_MODE_TYPE), required: true },
  referenceRequired: { type: Boolean, default: false },
  bankNameRequired: { type: Boolean, default: false },
  proofRequired: { type: Boolean, default: false },
  needsVerification: { type: Boolean, default: false },
  settlementAccount: { type: String }, // Cash / Bank Account Name
  isOnlineGateway: { type: Boolean, default: false },
  description: { type: String },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('PaymentMode', paymentModeSchema);
