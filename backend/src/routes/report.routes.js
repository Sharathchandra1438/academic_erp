const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const mongoose = require('mongoose');
const Receipt = require('../models/Receipt');
const PaymentTransaction = require('../models/PaymentTransaction');
const StudentLedgerEntry = require('../models/StudentLedgerEntry');
const Student = require('../models/Student');
const StudentFeeAssignment = require('../models/StudentFeeAssignment');
router.use(protect);

// Date-wise collection report
router.get('/collection', async (req, res, next) => {
  try {
    const { from, to, paymentModeId } = req.query;
    const match = { organisationId: new mongoose.Types.ObjectId(req.organisationId), status: 'Generated' };
    if (from || to) { match.receiptDate = {}; if (from) match.receiptDate.$gte = new Date(from); if (to) match.receiptDate.$lte = new Date(to); }
    const d = await Receipt.find(match).populate('studentId', 'name admissionNumber').populate('issuedBy', 'name').sort({ receiptDate: -1 });
    const total = d.reduce((s, r) => s + r.totalAmount, 0);
    res.json({ success: true, data: d, summary: { total, count: d.length } });
  } catch (e) { next(e); }
});

// Class-wise due report
router.get('/class-due', async (req, res, next) => {
  try {
    const { academicYearId } = req.query;
    const match = { organisationId: new mongoose.Types.ObjectId(req.organisationId), isActive: true };
    if (academicYearId) match.academicYearId = new mongoose.Types.ObjectId(academicYearId);
    const d = await StudentFeeAssignment.aggregate([
      { $match: match },
      { $group: { _id: '$classId', totalAssigned: { $sum: '$totalAssigned' }, totalPaid: { $sum: '$totalPaid' }, totalDue: { $sum: '$totalDue' }, count: { $sum: 1 } } },
      { $lookup: { from: 'classes', localField: '_id', foreignField: '_id', as: 'cls' } },
      { $unwind: '$cls' },
      { $project: { className: '$cls.name', totalAssigned: 1, totalPaid: 1, totalDue: 1, count: 1 } },
    ]);
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

// Payment mode wise report
router.get('/payment-mode', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const match = { organisationId: new mongoose.Types.ObjectId(req.organisationId), status: { $in: ['Success', 'Verified', 'Reconciled'] } };
    if (from || to) { match.paymentDate = {}; if (from) match.paymentDate.$gte = new Date(from); if (to) match.paymentDate.$lte = new Date(to); }
    const d = await PaymentTransaction.aggregate([
      { $match: match },
      { $group: { _id: '$paymentModeName', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

// Cashbook (cash only)
router.get('/cashbook', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const match = { organisationId: new mongoose.Types.ObjectId(req.organisationId), paymentModeName: 'Cash', status: { $in: ['Success', 'Verified', 'Reconciled'] } };
    if (from || to) { match.paymentDate = {}; if (from) match.paymentDate.$gte = new Date(from); if (to) match.paymentDate.$lte = new Date(to); }
    const d = await PaymentTransaction.find(match).populate('studentId', 'name admissionNumber').populate('collectedBy', 'name').sort({ paymentDate: -1 });
    const total = d.reduce((s, t) => s + t.amount, 0);
    res.json({ success: true, data: d, summary: { total, count: d.length } });
  } catch (e) { next(e); }
});

// Bankbook (bank/online)
router.get('/bankbook', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const match = { organisationId: new mongoose.Types.ObjectId(req.organisationId), paymentModeName: { $ne: 'Cash' }, status: { $in: ['Success', 'Verified', 'Reconciled'] } };
    if (from || to) { match.paymentDate = {}; if (from) match.paymentDate.$gte = new Date(from); if (to) match.paymentDate.$lte = new Date(to); }
    const d = await PaymentTransaction.find(match).populate('studentId', 'name admissionNumber').sort({ paymentDate: -1 });
    const total = d.reduce((s, t) => s + t.amount, 0);
    res.json({ success: true, data: d, summary: { total, count: d.length } });
  } catch (e) { next(e); }
});

// Staff-wise collection
router.get('/staff-collection', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const match = { organisationId: new mongoose.Types.ObjectId(req.organisationId), status: { $in: ['Success', 'Verified', 'Reconciled'] } };
    if (from || to) { match.paymentDate = {}; if (from) match.paymentDate.$gte = new Date(from); if (to) match.paymentDate.$lte = new Date(to); }
    const d = await PaymentTransaction.aggregate([
      { $match: match },
      { $group: { _id: '$collectedBy', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'staff' } },
      { $unwind: '$staff' },
      { $project: { staffName: '$staff.name', total: 1, count: 1 } },
    ]);
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

module.exports = router;
