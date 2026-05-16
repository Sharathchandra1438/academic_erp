const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const PaymentTransaction = require('../models/PaymentTransaction');
const ReconciliationLog = require('../models/ReconciliationLog');
const { PAYMENT_STATUS } = require('../config/constants');
const { createAuditEntry } = require('../middleware/audit.middleware');
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { studentId, academicYearId, status, paymentModeId, from, to } = req.query;
    const filter = { organisationId: req.organisationId };
    if (studentId) filter.studentId = studentId;
    if (academicYearId) filter.academicYearId = academicYearId;
    if (status) filter.status = status;
    if (paymentModeId) filter.paymentModeId = paymentModeId;
    if (from || to) { filter.paymentDate = {}; if (from) filter.paymentDate.$gte = new Date(from); if (to) filter.paymentDate.$lte = new Date(to); }
    const d = await PaymentTransaction.find(filter).populate('studentId', 'name admissionNumber')
      .populate('paymentModeId', 'name').populate('collectedBy', 'name').sort({ paymentDate: -1 });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

// Verify payment
router.put('/:id/verify', async (req, res, next) => {
  try {
    const d = await PaymentTransaction.findByIdAndUpdate(req.params.id, { status: PAYMENT_STATUS.VERIFIED, verifiedBy: req.user._id, verifiedAt: new Date() }, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

// Reconcile
router.put('/:id/reconcile', async (req, res, next) => {
  try {
    const tx = await PaymentTransaction.findByIdAndUpdate(req.params.id, { status: PAYMENT_STATUS.RECONCILED, verifiedBy: req.user._id, verifiedAt: new Date(), netSettled: req.body.netSettled, gatewayCharge: req.body.gatewayCharge }, { new: true });
    await ReconciliationLog.create({ transactionId: tx._id, receiptId: tx.receiptId, studentId: tx.studentId, amount: tx.amount, status: 'Reconciled', gatewaySettlement: req.body.netSettled, gatewayCharge: req.body.gatewayCharge, reconcileDate: new Date(), reconciledBy: req.user._id, organisationId: req.organisationId });
    res.json({ success: true, data: tx });
  } catch (e) { next(e); }
});

// Correct payment mode
router.put('/:id/correct-mode', async (req, res, next) => {
  try {
    const tx = await PaymentTransaction.findById(req.params.id);
    const oldMode = tx.paymentModeName;
    await createAuditEntry({ userId: req.user._id, userName: req.user.name, action: 'payment_mode_correction', module: 'payment', recordId: tx._id, oldValue: { paymentModeName: oldMode }, newValue: { paymentModeName: req.body.paymentModeName }, reason: req.body.reason, organisationId: req.organisationId });
    tx.paymentModeId = req.body.paymentModeId; tx.paymentModeName = req.body.paymentModeName;
    tx.isCorrected = true; tx.correctionReason = req.body.reason; tx.correctedBy = req.user._id;
    await tx.save();
    res.json({ success: true, data: tx });
  } catch (e) { next(e); }
});

// Mark cheque cleared/bounced
router.put('/:id/cheque-status', async (req, res, next) => {
  try {
    const { chequeStatus } = req.body;
    const update = { chequeStatus };
    if (chequeStatus === 'Bounced') update.status = PAYMENT_STATUS.BOUNCED;
    else if (chequeStatus === 'Cleared') update.status = PAYMENT_STATUS.RECONCILED;
    const d = await PaymentTransaction.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

module.exports = router;
