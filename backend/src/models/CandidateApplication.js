const mongoose = require('mongoose');
const { ADMISSION_STATUS } = require('../config/constants');

const overrideSchema = new mongoose.Schema({
  stageId: String,
  ruleBypassed: String,
  reason: { type: String, required: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  followUpDeadline: Date,
  overriddenAt: { type: Date, default: Date.now },
});

const candidateApplicationSchema = new mongoose.Schema({
  applicationNumber: { type: String, unique: true },
  enquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry' },
  applicationSaleId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApplicationSale', required: true },
  formTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApplicationFormTemplate' },
  formData: { type: mongoose.Schema.Types.Mixed, default: {} }, // dynamic form responses
  candidateName: { type: String, required: true },
  parentName: { type: String, required: true },
  parentMobile: { type: String, required: true },
  parentEmail: { type: String },
  dob: { type: Date },
  gender: { type: String },
  photo: { type: String },
  interestedClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  interestedSection: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  medium: { type: mongoose.Schema.Types.ObjectId, ref: 'Medium' },
  feeCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeCategory' },
  status: {
    type: String,
    enum: Object.values(ADMISSION_STATUS),
    default: ADMISSION_STATUS.FORM_SOLD,
  },
  currentPipelineStage: { type: String },
  pipelineInstanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'PipelineInstance' },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CandidateDocument' }],
  overrides: [overrideSchema],
  submittedAt: { type: Date },
  approvedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectedAt: { type: Date },
  rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String },
  admittedAt: { type: Date },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // set after admission
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('CandidateApplication', candidateApplicationSchema);
