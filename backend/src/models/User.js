const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation' },
  branchId: { type: mongoose.Schema.Types.ObjectId },
  photo: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  passwordChangedAt: { type: Date },
  refreshToken: { type: String },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
