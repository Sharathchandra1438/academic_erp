const mongoose = require('mongoose');
const { PIPELINE_STAGE_STATUS } = require('../config/constants');

const stageLogSchema = new mongoose.Schema({
  stageName: { type: String },
  stageOrder: { type: Number },
  status: { type: String, enum: Object.values(PIPELINE_STAGE_STATUS), default: PIPELINE_STAGE_STATUS.PENDING },
  startedAt: { type: Date },
  completedAt: { type: Date },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String },
  isOverridden: { type: Boolean, default: false },
  overrideReason: { type: String },
  overriddenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  checklist: [{ item: String, checked: Boolean }],
});

const pipelineInstanceSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'PipelineTemplate', required: true },
  templateVersion: { type: Number },
  referenceId: { type: mongoose.Schema.Types.ObjectId, required: true }, // applicationId / studentId
  referenceType: { type: String, required: true }, // 'application', 'student', 'promotion'
  currentStageOrder: { type: Number, default: 1 },
  currentStageName: { type: String },
  stages: [stageLogSchema],
  status: { type: String, enum: ['Active', 'Completed', 'Cancelled', 'On Hold'], default: 'Active' },
  completedAt: { type: Date },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
}, { timestamps: true });

module.exports = mongoose.model('PipelineInstance', pipelineInstanceSchema);
