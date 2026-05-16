const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Role = require('../models/Role');

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const roles = await Role.find({ $or: [{ organisationId: req.organisationId }, { isSystem: true }] });
    res.json({ success: true, data: roles });
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const role = await Role.create({ ...req.body, organisationId: req.organisationId });
    res.status(201).json({ success: true, data: role });
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: 'Role not found.' });
    if (role.isSystem) return res.status(403).json({ success: false, message: 'System roles cannot be modified.' });
    const updated = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
    if (role.isSystem) return res.status(403).json({ success: false, message: 'Cannot delete system roles.' });
    await Role.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Role deactivated.' });
  } catch (e) { next(e); }
});

module.exports = router;
