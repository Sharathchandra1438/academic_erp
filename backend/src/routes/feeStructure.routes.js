const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const FeeStructure = require('../models/FeeStructure');
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { academicYearId, classId } = req.query;
    const filter = { organisationId: req.organisationId, isActive: true };
    if (academicYearId) filter.academicYearId = academicYearId;
    if (classId) filter.classId = classId;
    const d = await FeeStructure.find(filter).populate('classId academicYearId').populate('items.feeHeadId', 'name');
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const d = await FeeStructure.findById(req.params.id).populate('classId academicYearId').populate('items.feeHeadId');
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});
router.post('/', async (req, res, next) => {
  try {
    const d = await FeeStructure.create({ ...req.body, organisationId: req.organisationId, createdBy: req.user._id });
    res.status(201).json({ success: true, data: d });
  } catch (e) { next(e); }
});
router.put('/:id', async (req, res, next) => {
  try {
    const d = await FeeStructure.findByIdAndUpdate(req.params.id, { ...req.body, updatedBy: req.user._id }, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});
module.exports = router;
