const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const ApplicationFormTemplate = require('../models/ApplicationFormTemplate');
const ApplicationSale = require('../models/ApplicationSale');
const ApplicationReceipt = require('../models/ApplicationReceipt');
const CandidateApplication = require('../models/CandidateApplication');
const { generateNumber } = require('../utils/numberSeries');

router.use(protect);

// ── Form Templates ──
router.get('/templates', async (req, res, next) => {
  try {
    const d = await ApplicationFormTemplate.find({ organisationId: req.organisationId });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.post('/templates', async (req, res, next) => {
  try {
    const d = await ApplicationFormTemplate.create({ ...req.body, organisationId: req.organisationId, createdBy: req.user._id });
    res.status(201).json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.put('/templates/:id', async (req, res, next) => {
  try {
    const d = await ApplicationFormTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.put('/templates/:id/publish', async (req, res, next) => {
  try {
    const d = await ApplicationFormTemplate.findByIdAndUpdate(req.params.id, { isPublished: true, publishedBy: req.user._id, publishedAt: new Date() }, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

// ── Application Sale ──
router.get('/sales', async (req, res, next) => {
  try {
    const { academicYearId } = req.query;
    const filter = { organisationId: req.organisationId };
    if (academicYearId) filter.academicYearId = academicYearId;
    const d = await ApplicationSale.find(filter).populate('applicationReceiptId enquiryId').sort({ createdAt: -1 });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.post('/sales', async (req, res, next) => {
  try {
    const receiptNumber = await generateNumber({ organisationId: req.organisationId, module: 'application_receipt', academicYearId: req.body.academicYearId });
    const appNum = await generateNumber({ organisationId: req.organisationId, module: 'application', academicYearId: req.body.academicYearId });

    const receipt = await ApplicationReceipt.create({
      receiptNumber, candidateName: req.body.candidateName, parentName: req.body.parentName,
      parentMobile: req.body.parentMobile, amount: req.body.applicationFeeAmount || 0,
      paymentMode: req.body.paymentMode, paymentReference: req.body.paymentReference,
      collectedBy: req.user._id, academicYearId: req.body.academicYearId, organisationId: req.organisationId,
    });

    const sale = await ApplicationSale.create({
      ...req.body, applicationSaleNumber: appNum, applicationReceiptId: receipt._id,
      soldBy: req.user._id, organisationId: req.organisationId,
    });

    res.status(201).json({ success: true, data: { sale, receipt } });
  } catch (e) { next(e); }
});

// ── Candidate Applications ──
router.get('/candidates', async (req, res, next) => {
  try {
    const { status, academicYearId } = req.query;
    const filter = { organisationId: req.organisationId };
    if (status) filter.status = status;
    if (academicYearId) filter.academicYearId = academicYearId;
    const d = await CandidateApplication.find(filter).populate('interestedClass').sort({ createdAt: -1 });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.get('/candidates/:id', async (req, res, next) => {
  try {
    const d = await CandidateApplication.findById(req.params.id).populate('interestedClass interestedSection medium feeCategory documents');
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.post('/candidates', async (req, res, next) => {
  try {
    const appNum = await generateNumber({ organisationId: req.organisationId, module: 'application', academicYearId: req.body.academicYearId });
    const d = await CandidateApplication.create({ ...req.body, applicationNumber: appNum, organisationId: req.organisationId, createdBy: req.user._id });
    res.status(201).json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.put('/candidates/:id', async (req, res, next) => {
  try {
    const d = await CandidateApplication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

module.exports = router;
