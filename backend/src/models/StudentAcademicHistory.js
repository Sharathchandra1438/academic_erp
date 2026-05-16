const mongoose = require('mongoose');

// Track every class/section change per student per year
const studentAcademicHistorySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  rollNumber: { type: String },
  mediumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medium' },
  feeCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeCategory' },
  promotionDecision: { type: String }, // Promote/Hold/Demote
  promotionBatchId: { type: mongoose.Schema.Types.ObjectId, ref: 'PromotionBatch' },
  result: { type: String }, // Pass/Fail/Compartment
  remarks: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('StudentAcademicHistory', studentAcademicHistorySchema);
