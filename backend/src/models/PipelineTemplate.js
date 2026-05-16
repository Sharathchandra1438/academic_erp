const mongoose = require('mongoose');
const { PIPELINE_TYPE, PIPELINE_STAGE_STATUS } = require('../config/constants');

const stageRuleSchema = new mongoose.Schema({
  ruleType: { type: String, enum: ['Blocking', 'Warning', 'Optional'], default: 'Blocking' },
  description: { type: String },
  condition: { type: String }, // e.g., 'payment_required', 'documents_verified'
});

const pipelineStageSchema = new mongoose.Schema({
  stageName: { type: String, required: true },
  stageOrder: { type: Number, required: true },
  stageOwnerRole: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  requiredPayment: { type: Boolean, default: false },
  requiredPaymentAmount: { type: Number },
  requiredDocuments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DocumentRequirement' }],
  approvalRequired: { type: Boolean, default: false },
  approverRole: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  checklist: [String],
  rules: [stageRuleSchema],
  slaDays: { type: Number },
  escalationDays: { type: Number },
  escalationNotifyRole: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  isActive: { type: Boolean, default: true },
});

const pipelineTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pipelineType: { type: String, enum: Object.values(PIPELINE_TYPE), required: true },
  description: { type: String },
  stages: [pipelineStageSchema],
  version: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  effectiveFrom: { type: Date },
  lockedAt: { type: Date }, // once used, locked for versioning
}, { timestamps: true });

module.exports = mongoose.model('PipelineTemplate', pipelineTemplateSchema);
