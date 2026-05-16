const mongoose = require('mongoose');
const { FEE_STATUS } = require('../config/constants');

const installmentSchema = new mongoose.Schema({
  installmentNumber: { type: Number, required: true },
  label: { type: String }, // Term 1, Month 1, etc.
  dueDate: { type: Date },
  amount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Pending', 'Partially Paid', 'Paid', 'Overdue', 'Closed'],
    default: 'Pending'
  },
  closedReason: { type: String }, // e.g. 'Plan Changed'
  paidAt: { type: Date },
});

const feeHeadSnapshotSchema = new mongoose.Schema({
  feeHeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeHead' },
  feeHeadName: { type: String },
  amount: { type: Number },
  paidAmount: { type: Number, default: 0 },
  balanceAmount: { type: Number },
  priority: { type: Number },
});

const studentFeeAssignmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  feeStructureId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeStructure' },
  feeStructureVersion: { type: Number },
  repaymentModeId: { type: mongoose.Schema.Types.ObjectId, ref: 'RepaymentMode' },
  // SNAPSHOT of fee structure at time of assignment
  feeHeads: [feeHeadSnapshotSchema],
  totalAssigned: { type: Number, required: true },
  totalPaid: { type: Number, default: 0 },
  totalDue: { type: Number },
  totalAdvance: { type: Number, default: 0 },
  installments: [installmentSchema],
  status: { 
    type: String, 
    enum: Object.values(FEE_STATUS), 
    default: FEE_STATUS.ASSIGNED 
  },
  version: { type: Number, default: 1 }, // for fee reconfiguration
  previousVersionId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentFeeAssignment' },
  isActive: { type: Boolean, default: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
}, { timestamps: true });

// Ensure one active assignment per student per academic year
studentFeeAssignmentSchema.index(
  { studentId: 1, academicYearId: 1, isActive: 1 }, 
  { unique: true, partialFilterExpression: { isActive: true } }
);

module.exports = mongoose.model('StudentFeeAssignment', studentFeeAssignmentSchema);
