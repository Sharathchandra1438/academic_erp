const mongoose = require('mongoose');
const { ADMISSION_STATUS } = require('../config/constants');

const applicationSaleSchema = new mongoose.Schema({
  applicationSaleNumber: { type: String },
  enquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry' },
  candidateName: { type: String, required: true },
  parentName: { type: String, required: true },
  parentMobile: { type: String, required: true },
  interestedClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  applicationFeeAmount: { type: Number, required: true, default: 0 },
  paymentMode: { type: String },
  paymentReference: { type: String },
  applicationReceiptId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApplicationReceipt' },
  formTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApplicationFormTemplate' },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId },
  soldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'Active', enum: ['Active', 'Cancelled'] },
}, { timestamps: true });

module.exports = mongoose.model('ApplicationSale', applicationSaleSchema);
