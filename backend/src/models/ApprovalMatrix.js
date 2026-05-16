const mongoose = require('mongoose');

const approvalMatrixSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., 'approve_admission', 'cancel_receipt'
  module: { type: String, required: true },
  minApprovalLevel: { type: Number, default: 1 },
  approverRoles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  requiresReason: { type: Boolean, default: false },
  allowOverride: { type: Boolean, default: false },
  overrideRoles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('ApprovalMatrix', approvalMatrixSchema);
