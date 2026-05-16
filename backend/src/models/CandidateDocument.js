const mongoose = require('mongoose');

const candidateDocumentSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'CandidateApplication', required: true },
  requirementId: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentRequirement' },
  documentName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String },
  fileSizeKB: { type: Number },
  status: { 
    type: String, 
    enum: ['Uploaded', 'Under Review', 'Verified', 'Rejected'], 
    default: 'Uploaded' 
  },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date },
  rejectionReason: { type: String },
  remarks: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('CandidateDocument', candidateDocumentSchema);
