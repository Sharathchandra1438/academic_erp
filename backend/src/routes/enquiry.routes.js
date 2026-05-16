const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Enquiry = require('../models/Enquiry');
const { generateNumber } = require('../utils/numberSeries');

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { status, academicYearId, page = 1, limit = 20 } = req.query;
    const filter = { organisationId: req.organisationId };
    if (status) filter.status = status;
    if (academicYearId) filter.academicYearId = academicYearId;
    const total = await Enquiry.countDocuments(filter);
    const data = await Enquiry.find(filter)
      .populate('interestedClass', 'name').populate('assignedTo', 'name')
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, data, total, page: Number(page) });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const d = await Enquiry.findById(req.params.id).populate('interestedClass assignedTo medium');
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const enquiryNumber = await generateNumber({ organisationId: req.organisationId, module: 'enquiry', academicYearId: req.body.academicYearId });
    const d = await Enquiry.create({ ...req.body, enquiryNumber, organisationId: req.organisationId, createdBy: req.user._id });
    res.status(201).json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const d = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.post('/:id/follow-up', async (req, res, next) => {
  try {
    const { note, followUpDate, status } = req.body;
    const d = await Enquiry.findByIdAndUpdate(req.params.id, {
      $push: { followUpNotes: { note, date: new Date(), staffId: req.user._id } },
      ...(followUpDate && { followUpDate }), ...(status && { status }),
    }, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

module.exports = router;
