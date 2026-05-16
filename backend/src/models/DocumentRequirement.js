const mongoose = require('mongoose');

const documentRequirementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  isRequired: { type: Boolean, default: true },
  acceptedFormats: [String], // ['pdf', 'jpg', 'png']
  maxSizeMB: { type: Number, default: 5 },
  pipelineStage: { type: String },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('DocumentRequirement', documentRequirementSchema);
