const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String },
  action: { type: String, required: true },
  module: { type: String, required: true },
  recordId: { type: mongoose.Schema.Types.ObjectId },
  recordType: { type: String },
  oldValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },
  reason: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
  sessionId: { type: String },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation' },
  branchId: { type: mongoose.Schema.Types.ObjectId },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: false });

auditLogSchema.index({ organisationId: 1, timestamp: -1 });
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ module: 1, action: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
