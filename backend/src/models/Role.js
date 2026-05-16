const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  module: { type: String, required: true },
  action: { type: String, required: true },
  description: { type: String },
});

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  permissions: [permissionSchema],
  isSystem: { type: Boolean, default: false }, // system roles cannot be deleted
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
