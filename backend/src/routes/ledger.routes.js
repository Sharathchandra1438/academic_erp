const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const StudentLedgerEntry = require('../models/StudentLedgerEntry');
router.use(protect);

router.get('/:studentId', async (req, res, next) => {
  try {
    const { academicYearId } = req.query;
    const filter = { studentId: req.params.studentId };
    if (academicYearId) filter.academicYearId = academicYearId;
    const d = await StudentLedgerEntry.find(filter).sort({ createdAt: 1 });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.get('/:studentId/balance', async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    const { academicYearId } = req.query;
    const match = { studentId: new mongoose.Types.ObjectId(req.params.studentId) };
    if (academicYearId) match.academicYearId = new mongoose.Types.ObjectId(academicYearId);
    const result = await StudentLedgerEntry.aggregate([
      { $match: match },
      { $group: { _id: null, totalDebit: { $sum: '$debitAmount' }, totalCredit: { $sum: '$creditAmount' } } },
    ]);
    const { totalDebit = 0, totalCredit = 0 } = result[0] || {};
    res.json({ success: true, data: { totalDebit, totalCredit, balance: totalDebit - totalCredit } });
  } catch (e) { next(e); }
});

module.exports = router;
