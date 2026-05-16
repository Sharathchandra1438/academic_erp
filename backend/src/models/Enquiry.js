const mongoose = require('mongoose');
const { ADMISSION_STATUS } = require('../config/constants');

const enquirySchema = new mongoose.Schema({
  enquiryNumber: { type: String },
  candidateName: { type: String, required: true, trim: true },
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  parentName: { type: String, required: true, trim: true },
  parentMobile: { type: String, required: true },
  parentEmail: { type: String },
  interestedClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  interestedSection: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  medium: { type: mongoose.Schema.Types.ObjectId, ref: 'Medium' },
  source: { 
    type: String, 
    enum: ['Walk-in', 'Phone', 'Website', 'Social Media', 'Referral', 'Camp', 'Other'],
    default: 'Walk-in'
  },
  referredBy: { type: String },
  followUpDate: { type: Date },
  followUpNotes: [{ 
    note: String, 
    date: Date, 
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
  }],
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Interested', 'Not Interested', 'Form Sold', 'Converted', 'Lost'],
    default: 'New'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  previousSchool: { type: String },
  remarks: { type: String },
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
