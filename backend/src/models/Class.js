const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // e.g., "Class 6", "Grade 10"
  code: { type: String, trim: true },
  order: { type: Number, default: 0 }, // for sorting
  level: { type: String }, // e.g., Primary, Secondary, Higher Secondary
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

classSchema.index({ organisationId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);
