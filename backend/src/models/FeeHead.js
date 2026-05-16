const mongoose = require('mongoose');

const feeHeadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // Tuition Fee, Transport Fee, etc.
  code: { type: String, trim: true },
  description: { type: String },
  priority: { type: Number, default: 99 }, // lower = higher priority in payment allocation
  isTaxable: { type: Boolean, default: false },
  isRefundable: { type: Boolean, default: false },
  category: { 
    type: String, 
    enum: ['Academic', 'Transport', 'Hostel', 'Miscellaneous', 'Fine', 'Scholarship', 'Concession', 'Other'],
    default: 'Academic'
  },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('FeeHead', feeHeadSchema);
