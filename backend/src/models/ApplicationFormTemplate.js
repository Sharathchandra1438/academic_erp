const mongoose = require('mongoose');

const formFieldSchema = new mongoose.Schema({
  fieldKey: { type: String, required: true },
  label: { type: String, required: true },
  fieldType: {
    type: String,
    required: true,
    enum: ['text', 'number', 'date', 'dropdown', 'radio', 'checkbox', 'address', 'file', 'document', 'textarea', 'email', 'phone'],
  },
  section: { type: String, required: true }, // Student Details, Parent Details, etc.
  order: { type: Number, default: 0 },
  isRequired: { type: Boolean, default: false },
  options: [String], // for dropdown/radio/checkbox
  placeholder: { type: String },
  helpText: { type: String },
  mapsToStudentField: { type: String }, // maps to student model field
  validation: {
    minLength: Number,
    maxLength: Number,
    pattern: String,
    min: Number,
    max: Number,
  },
  isActive: { type: Boolean, default: true },
});

const applicationFormTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  sections: [{ name: String, order: Number, description: String }],
  fields: [formFieldSchema],
  isPublished: { type: Boolean, default: false },
  version: { type: Number, default: 1 },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  publishedAt: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('ApplicationFormTemplate', applicationFormTemplateSchema);
