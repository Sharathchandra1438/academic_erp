const mongoose = require('mongoose');
const { ACADEMIC_STATUS } = require('../config/constants');

const guardianSchema = new mongoose.Schema({
  relation: { type: String, enum: ['Father', 'Mother', 'Guardian', 'Other'], default: 'Father' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  occupation: { type: String },
  qualification: { type: String },
  annualIncome: { type: Number },
  aadhar: { type: String },
  photo: { type: String },
  isPrimary: { type: Boolean, default: false },
});

const studentSchema = new mongoose.Schema({
  admissionNumber: { type: String, required: true, unique: true },
  rollNumber: { type: String },
  name: { type: String, required: true, trim: true },
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  photo: { type: String },
  bloodGroup: { type: String },
  aadhar: { type: String },
  religion: { type: String },
  caste: { type: String },
  category: { type: String }, // SC/ST/OBC/General
  motherTongue: { type: String },
  nationality: { type: String, default: 'Indian' },
  address: {
    doorNo: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  permanentAddress: {
    doorNo: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  guardians: [guardianSchema],
  previousSchool: { type: String },
  tcNumber: { type: String },
  currentAcademicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' },
  currentClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  currentSectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  mediumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medium' },
  feeCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeCategory' },
  academicStatus: { 
    type: String, 
    enum: Object.values(ACADEMIC_STATUS), 
    default: ACADEMIC_STATUS.ADMITTED 
  },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'CandidateApplication' },
  loginEnabled: { type: Boolean, default: false },
  loginUsername: { type: String },
  loginPasswordHash: { type: String },
  admissionDate: { type: Date },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

studentSchema.index({ organisationId: 1, admissionNumber: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);
