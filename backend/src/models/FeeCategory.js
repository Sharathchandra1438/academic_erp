const mongoose = require('mongoose');

const feeCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // General, Staff Ward, SC/ST, Scholarship
  description: { type: String },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('FeeCategory', feeCategorySchema);
