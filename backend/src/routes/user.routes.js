const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const User = require('../models/User');
const Role = require('../models/Role');

router.use(protect);

// GET all users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({ organisationId: req.organisationId }).populate('roleId', 'name');
    res.json({ success: true, data: users });
  } catch (e) { next(e); }
});

// GET single user
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('roleId');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: user });
  } catch (e) { next(e); }
});

// POST create user
router.post('/', async (req, res, next) => {
  try {
    const { name, email, password, roleId, phone, branchId } = req.body;
    const user = await User.create({
      name, email, passwordHash: password, roleId, phone, branchId,
      organisationId: req.organisationId,
    });
    res.status(201).json({ success: true, data: user });
  } catch (e) { next(e); }
});

// PUT update user
router.put('/:id', async (req, res, next) => {
  try {
    const { name, phone, roleId, branchId, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, roleId, branchId, isActive },
      { new: true, runValidators: true }
    ).populate('roleId');
    res.json({ success: true, data: user });
  } catch (e) { next(e); }
});

// PUT reset password
router.put('/:id/reset-password', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.passwordHash = req.body.newPassword;
    await user.save();
    res.json({ success: true, message: 'Password reset successfully.' });
  } catch (e) { next(e); }
});

// DELETE (deactivate) user
router.delete('/:id', async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'User deactivated.' });
  } catch (e) { next(e); }
});

module.exports = router;
