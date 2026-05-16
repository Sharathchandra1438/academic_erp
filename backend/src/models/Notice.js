const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  targetAudience: { type: String, enum: ['All', 'Students', 'Parents', 'Staff'], default: 'All' },
  classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  expiresAt: { type: Date },
  attachmentPath: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
