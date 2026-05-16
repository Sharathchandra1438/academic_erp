const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const BonafideRequest = require('../models/BonafideRequest');
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { status, studentId } = req.query;
    const filter = { organisationId: req.organisationId };
    if (status) filter.status = status;
    if (studentId) filter.studentId = studentId;
    const d = await BonafideRequest.find(filter).populate('studentId', 'name admissionNumber').sort({ createdAt: -1 });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});
router.post('/', async (req, res, next) => {
  try {
    const d = await BonafideRequest.create({ ...req.body, organisationId: req.organisationId });
    res.status(201).json({ success: true, data: d });
  } catch (e) { next(e); }
});
router.put('/:id/approve', async (req, res, next) => {
  try {
    const d = await BonafideRequest.findByIdAndUpdate(req.params.id, { status: 'Approved', approvedBy: req.user._id, approvedAt: new Date() }, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});
router.put('/:id/generate', async (req, res, next) => {
  try {
    const d = await BonafideRequest.findByIdAndUpdate(req.params.id, { status: 'Generated', generatedBy: req.user._id, generatedAt: new Date() }, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});
module.exports = router;
