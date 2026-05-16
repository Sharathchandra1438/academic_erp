const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { collectFee, cancelReceipt } = require('../services/receipt.service');
const Receipt = require('../models/Receipt');
router.use(protect);

// Get receipts with filters
router.get('/', async (req, res, next) => {
  try {
    const { studentId, academicYearId, status, from, to, page = 1, limit = 20 } = req.query;
    const filter = { organisationId: req.organisationId };
    if (studentId) filter.studentId = studentId;
    if (academicYearId) filter.academicYearId = academicYearId;
    if (status) filter.status = status;
    if (from || to) {
      filter.receiptDate = {};
      if (from) filter.receiptDate.$gte = new Date(from);
      if (to) filter.receiptDate.$lte = new Date(to);
    }
    const total = await Receipt.countDocuments(filter);
    const d = await Receipt.find(filter).populate('studentId', 'name admissionNumber')
      .populate('issuedBy', 'name').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, data: d, total });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const d = await Receipt.findById(req.params.id)
      .populate('studentId').populate('linkedTransactions').populate('issuedBy', 'name');
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

// Collect fee (main payment endpoint)
router.post('/collect', async (req, res, next) => {
  try {
    const result = await collectFee({ ...req.body, collectedBy: req.user._id, organisationId: req.organisationId });
    res.status(201).json({ success: true, data: result });
  } catch (e) { next(e); }
});

// Cancel receipt
router.put('/:id/cancel', async (req, res, next) => {
  try {
    const result = await cancelReceipt({ receiptId: req.params.id, reason: req.body.reason, cancelledBy: req.user._id, organisationId: req.organisationId });
    res.json({ success: true, data: result });
  } catch (e) { next(e); }
});

// Reprint tracking
router.put('/:id/reprint', async (req, res, next) => {
  try {
    const d = await Receipt.findByIdAndUpdate(req.params.id, { $inc: { printCount: 1 }, lastPrintedAt: new Date() }, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

module.exports = router;
