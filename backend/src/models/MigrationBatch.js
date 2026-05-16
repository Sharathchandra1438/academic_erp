const mongoose = require('mongoose');
const { MIGRATION_STATUS } = require('../config/constants');

const migrationBatchSchema = new mongoose.Schema({
  batchNumber: { type: String },
  migrationType: {
    type: String,
    enum: [
      'student_master', 'parent_guardian', 'opening_fee_balance',
      'previous_receipt', 'academic_history', 'application_enquiry',
      'fee_structure', 'transport_data', 'hostel_data',
      'staff_user', 'documents_index'
    ],
    required: true,
  },
  sourceFileName: { type: String },
  sourceFilePath: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: Object.values(MIGRATION_STATUS), default: MIGRATION_STATUS.UPLOADED },
  totalRows: { type: Number, default: 0 },
  validRows: { type: Number, default: 0 },
  errorRows: { type: Number, default: 0 },
  importedRows: { type: Number, default: 0 },
  validationErrors: [{ row: Number, column: String, error: String, value: String }],
  rollbackStatus: { type: String, enum: ['Not Rolled Back', 'Rolled Back', 'Partial'], default: 'Not Rolled Back' },
  rollbackAt: { type: Date },
  rollbackBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isLocked: { type: Boolean, default: false },
  lockedAt: { type: Date },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
}, { timestamps: true });

module.exports = mongoose.model('MigrationBatch', migrationBatchSchema);
