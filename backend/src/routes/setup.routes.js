const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Organisation = require('../models/Organisation');
const AcademicYear = require('../models/AcademicYear');
const Class = require('../models/Class');
const Section = require('../models/Section');
const Medium = require('../models/Medium');
const FeeCategory = require('../models/FeeCategory');
const NumberSeries = require('../models/NumberSeries');
const ApprovalMatrix = require('../models/ApprovalMatrix');

router.use(protect);

// ── Organisation ──────────────────────────────────────────
router.get('/organisation', async (req, res, next) => {
  try {
    const org = await Organisation.findById(req.organisationId);
    res.json({ success: true, data: org });
  } catch (e) { next(e); }
});

router.post('/organisation', async (req, res, next) => {
  try {
    const org = await Organisation.create(req.body);
    res.status(201).json({ success: true, data: org });
  } catch (e) { next(e); }
});

router.put('/organisation/:id', async (req, res, next) => {
  try {
    const org = await Organisation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: org });
  } catch (e) { next(e); }
});

// ── Academic Year ──────────────────────────────────────────
router.get('/academic-years', async (req, res, next) => {
  try {
    const years = await AcademicYear.find({ organisationId: req.organisationId }).sort({ startDate: -1 });
    res.json({ success: true, data: years });
  } catch (e) { next(e); }
});

router.post('/academic-years', async (req, res, next) => {
  try {
    const year = await AcademicYear.create({ ...req.body, organisationId: req.organisationId, createdBy: req.user._id });
    res.status(201).json({ success: true, data: year });
  } catch (e) { next(e); }
});

router.put('/academic-years/:id/activate', async (req, res, next) => {
  try {
    await AcademicYear.updateMany({ organisationId: req.organisationId }, { isActive: false });
    const year = await AcademicYear.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    res.json({ success: true, data: year });
  } catch (e) { next(e); }
});

router.put('/academic-years/:id', async (req, res, next) => {
  try {
    const year = await AcademicYear.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: year });
  } catch (e) { next(e); }
});

// ── Classes ──────────────────────────────────────────────
router.get('/classes', async (req, res, next) => {
  try {
    const classes = await Class.find({ organisationId: req.organisationId, isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: classes });
  } catch (e) { next(e); }
});

router.post('/classes', async (req, res, next) => {
  try {
    const cls = await Class.create({ ...req.body, organisationId: req.organisationId });
    res.status(201).json({ success: true, data: cls });
  } catch (e) { next(e); }
});

router.put('/classes/:id', async (req, res, next) => {
  try {
    const cls = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: cls });
  } catch (e) { next(e); }
});

router.delete('/classes/:id', async (req, res, next) => {
  try {
    await Class.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Class deactivated.' });
  } catch (e) { next(e); }
});

// ── Sections ──────────────────────────────────────────────
router.get('/sections', async (req, res, next) => {
  try {
    const { classId } = req.query;
    const filter = { organisationId: req.organisationId, isActive: true };
    if (classId) filter.classId = classId;
    const sections = await Section.find(filter).populate('classId', 'name');
    res.json({ success: true, data: sections });
  } catch (e) { next(e); }
});

router.post('/sections', async (req, res, next) => {
  try {
    const section = await Section.create({ ...req.body, organisationId: req.organisationId });
    res.status(201).json({ success: true, data: section });
  } catch (e) { next(e); }
});

router.put('/sections/:id', async (req, res, next) => {
  try {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: section });
  } catch (e) { next(e); }
});

// ── Mediums ──────────────────────────────────────────────
router.get('/mediums', async (req, res, next) => {
  try {
    const mediums = await Medium.find({ organisationId: req.organisationId, isActive: true });
    res.json({ success: true, data: mediums });
  } catch (e) { next(e); }
});

router.post('/mediums', async (req, res, next) => {
  try {
    const medium = await Medium.create({ ...req.body, organisationId: req.organisationId });
    res.status(201).json({ success: true, data: medium });
  } catch (e) { next(e); }
});

// ── Fee Categories ─────────────────────────────────────────
router.get('/fee-categories', async (req, res, next) => {
  try {
    const cats = await FeeCategory.find({ organisationId: req.organisationId, isActive: true });
    res.json({ success: true, data: cats });
  } catch (e) { next(e); }
});

router.post('/fee-categories', async (req, res, next) => {
  try {
    const cat = await FeeCategory.create({ ...req.body, organisationId: req.organisationId });
    res.status(201).json({ success: true, data: cat });
  } catch (e) { next(e); }
});

// ── Number Series ──────────────────────────────────────────
router.get('/number-series', async (req, res, next) => {
  try {
    const series = await NumberSeries.find({ organisationId: req.organisationId });
    res.json({ success: true, data: series });
  } catch (e) { next(e); }
});

router.post('/number-series', async (req, res, next) => {
  try {
    const s = await NumberSeries.create({ ...req.body, organisationId: req.organisationId });
    res.status(201).json({ success: true, data: s });
  } catch (e) { next(e); }
});

router.put('/number-series/:id', async (req, res, next) => {
  try {
    const s = await NumberSeries.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: s });
  } catch (e) { next(e); }
});

// ── Approval Matrix ────────────────────────────────────────
router.get('/approval-matrix', async (req, res, next) => {
  try {
    const matrix = await ApprovalMatrix.find({ organisationId: req.organisationId }).populate('approverRoles overrideRoles', 'name');
    res.json({ success: true, data: matrix });
  } catch (e) { next(e); }
});

router.post('/approval-matrix', async (req, res, next) => {
  try {
    const item = await ApprovalMatrix.create({ ...req.body, organisationId: req.organisationId });
    res.status(201).json({ success: true, data: item });
  } catch (e) { next(e); }
});

module.exports = router;
