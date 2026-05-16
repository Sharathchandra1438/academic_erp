const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const StudentFeeAssignment = require('../models/StudentFeeAssignment');
const FeeStructure = require('../models/FeeStructure');
const RepaymentMode = require('../models/RepaymentMode');
const { generateInstallments } = require('../utils/feeEngine');
const { createLedgerEntry } = require('../services/ledger.service');
const { LEDGER_ENTRY_TYPE, FEE_STATUS } = require('../config/constants');

router.use(protect);

// Get student fee assignment
router.get('/:studentId', async (req, res, next) => {
  try {
    const { academicYearId } = req.query;
    const filter = { studentId: req.params.studentId, isActive: true };
    if (academicYearId) filter.academicYearId = academicYearId;
    const d = await StudentFeeAssignment.find(filter).populate('feeStructureId repaymentModeId classId');
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

// Assign fee to student (snapshot)
router.post('/', async (req, res, next) => {
  try {
    const { studentId, academicYearId, classId, sectionId, feeStructureId, repaymentModeId } = req.body;
    const fs = await FeeStructure.findById(feeStructureId).populate('items.feeHeadId');
    if (!fs) return res.status(404).json({ success: false, message: 'Fee structure not found.' });
    const rm = await RepaymentMode.findById(repaymentModeId);
    if (!rm) return res.status(404).json({ success: false, message: 'Repayment mode not found.' });

    // Create snapshot of fee heads
    const feeHeads = fs.items.map(item => ({
      feeHeadId: item.feeHeadId._id || item.feeHeadId,
      feeHeadName: item.feeHeadId.name || item.feeHeadName,
      amount: item.amount, paidAmount: 0, balanceAmount: item.amount,
      priority: item.feeHeadId.priority || 99,
    }));

    const installments = generateInstallments({
      totalAmount: fs.totalAmount, numberOfInstallments: rm.numberOfInstallments,
      startDate: new Date(), dueDayOfMonth: rm.dueDayOfMonth, customDueDates: rm.customDueDates,
    });

    const assignment = await StudentFeeAssignment.create({
      studentId, academicYearId, classId, sectionId,
      feeStructureId, feeStructureVersion: fs.version, repaymentModeId,
      feeHeads, totalAssigned: fs.totalAmount, totalPaid: 0, totalDue: fs.totalAmount,
      installments, status: FEE_STATUS.ASSIGNED,
      assignedBy: req.user._id, organisationId: req.organisationId,
    });

    // Post ledger debit entry (fee assigned)
    await createLedgerEntry({
      studentId, academicYearId, entryType: LEDGER_ENTRY_TYPE.FEE_ASSIGNED,
      debitAmount: fs.totalAmount, sourceType: 'fee_assignment', sourceId: assignment._id,
      particulars: `Fee Assigned: ${fs.name} | Total: ₹${fs.totalAmount}`,
      createdBy: req.user._id, organisationId: req.organisationId,
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (e) { next(e); }
});

// Reconfigure fee (versioning)
router.post('/:id/reconfigure', async (req, res, next) => {
  try {
    const old = await StudentFeeAssignment.findById(req.params.id);
    if (!old) return res.status(404).json({ success: false, message: 'Assignment not found.' });

    // Freeze old assignment
    old.isActive = false;
    old.status = 'Revised';
    await old.save();

    const { repaymentModeId, customAdjustments } = req.body;
    const rm = await RepaymentMode.findById(repaymentModeId || old.repaymentModeId);
    const remaining = old.totalAssigned - old.totalPaid;

    const installments = generateInstallments({
      totalAmount: remaining, numberOfInstallments: rm.numberOfInstallments,
      startDate: new Date(), dueDayOfMonth: rm.dueDayOfMonth,
    });

    const newAssignment = await StudentFeeAssignment.create({
      studentId: old.studentId, academicYearId: old.academicYearId,
      classId: old.classId, sectionId: old.sectionId,
      feeStructureId: old.feeStructureId, feeStructureVersion: old.feeStructureVersion,
      repaymentModeId: rm._id, feeHeads: old.feeHeads,
      totalAssigned: old.totalAssigned, totalPaid: old.totalPaid, totalDue: remaining,
      installments, version: old.version + 1, previousVersionId: old._id,
      status: FEE_STATUS.ASSIGNED, assignedBy: req.user._id, organisationId: req.organisationId,
    });

    res.json({ success: true, data: newAssignment });
  } catch (e) { next(e); }
});

module.exports = router;
