const mongoose = require('mongoose');

const feeStructureItemSchema = new mongoose.Schema({
  feeHeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeHead', required: true },
  feeHeadName: { type: String }, // snapshot
  amount: { type: Number, required: true },
  isOptional: { type: Boolean, default: false },
});

const feeStructureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' }, // optional
  mediumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medium' },
  feeCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeCategory' },
  branchId: { type: mongoose.Schema.Types.ObjectId },
  items: [feeStructureItemSchema],
  totalAmount: { type: Number, default: 0 },
  version: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Auto-calculate total
feeStructureSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + (item.amount || 0), 0);
  next();
});

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
