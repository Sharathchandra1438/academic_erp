const mongoose = require('mongoose');

// Number series ensures unique, non-reusable numbers per module
const numberSeriesSchema = new mongoose.Schema({
  module: { 
    type: String, 
    required: true,
    enum: ['receipt', 'application_receipt', 'application', 'student', 'enquiry', 'bonafide', 'tc', 'migration']
  },
  prefix: { type: String, required: true }, // e.g., "FR", "APP", "STU"
  suffix: { type: String, default: '' },
  separator: { type: String, default: '-' },
  currentSeq: { type: Number, default: 0 },
  padding: { type: Number, default: 5 }, // zero-pad to 5 digits
  resetOnAcademicYear: { type: Boolean, default: true },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  lastReset: { type: Date },
}, { timestamps: true });

numberSeriesSchema.index({ organisationId: 1, module: 1, academicYearId: 1 }, { unique: true });

// Method to generate next number
numberSeriesSchema.methods.generateNext = function () {
  this.currentSeq += 1;
  const seq = String(this.currentSeq).padStart(this.padding, '0');
  return `${this.prefix}${this.separator}${seq}${this.suffix ? this.separator + this.suffix : ''}`;
};

module.exports = mongoose.model('NumberSeries', numberSeriesSchema);
