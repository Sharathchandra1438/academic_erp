const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const DailyClosing = require('../models/DailyClosing');
const PaymentTransaction = require('../models/PaymentTransaction');
const mongoose = require('mongoose');
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const d = await DailyClosing.find({ organisationId: req.organisationId }).populate('closedBy approvedBy', 'name').sort({ closingDate: -1 });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { closingDate, academicYearId } = req.body;
    const start = new Date(closingDate); start.setHours(0, 0, 0, 0);
    const end = new Date(closingDate); end.setHours(23, 59, 59, 999);
    const match = { organisationId: new mongoose.Types.ObjectId(req.organisationId), paymentDate: { $gte: start, $lte: end }, status: { $in: ['Success', 'Verified', 'Reconciled'] } };
    const modeSummary = await PaymentTransaction.aggregate([
      { $match: match },
      { $group: { _id: '$paymentModeName', amount: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
    const totalCollected = modeSummary.reduce((s, m) => s + m.amount, 0);
    const cashCollection = modeSummary.filter(m => m._id === 'Cash').reduce((s, m) => s + m.amount, 0);
    const bankCollection = totalCollected - cashCollection;

    const closing = await DailyClosing.create({
      closingDate: start, closedBy: req.user._id, totalCollected, cashCollection,
      bankCollection, onlineCollection: bankCollection,
      receiptCount: modeSummary.reduce((s, m) => s + m.count, 0),
      paymentModeSummary: modeSummary.map(m => ({ paymentModeName: m._id, amount: m.amount, count: m.count })),
      status: 'Closed', isLocked: true, lockedAt: new Date(),
      organisationId: req.organisationId, academicYearId,
    });
    res.status(201).json({ success: true, data: closing });
  } catch (e) { next(e); }
});

module.exports = router;
