const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, trim: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  phone: { type: String },
  email: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const organisationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, trim: true },
  logo: { type: String }, // file path
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  receiptHeader: { type: String },
  certificateHeader: { type: String },
  principalName: { type: String },
  principalSignature: { type: String }, // file path
  currency: { type: String, default: 'INR' },
  academicYearFormat: { type: String, default: 'YYYY-YY' },
  branches: [branchSchema],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Organisation', organisationSchema);
