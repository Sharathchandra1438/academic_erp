const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Concession = require('../models/Concession');
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { status, studentId } = req.query;
    const filter = { organisationId: req.organisationId };
    if (status) filter.status = status;
    if (studentId) filter.studentId = studentId;
    const d = await Concession.find(filter).populate('studentId', 'name admissionNumber').populate('feeHeadId', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});
router.post('/', async (req, res, next) => {
  try {
    const d = await Concession.create({ ...req.body, requestedBy: req.user._id, organisationId: req.organisationId });
    res.status(201).json({ success: true, data: d });
  } catch (e) { next(e); }
});
router.put('/:id/approve', async (req, res, next) => {
  try {
    const d = await Concession.findByIdAndUpdate(req.params.id, { status: 'Approved', approvedBy: req.user._id, approvedAt: new Date() }, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});
router.put('/:id/reject', async (req, res, next) => {
  try {
    const d = await Concession.findByIdAndUpdate(req.params.id, { status: 'Rejected', rejectionReason: req.body.reason }, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});
module.exports = router;
