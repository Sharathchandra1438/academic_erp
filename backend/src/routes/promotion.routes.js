const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const PromotionBatch = require('../models/PromotionBatch');
const Student = require('../models/Student');
const StudentAcademicHistory = require('../models/StudentAcademicHistory');
const StudentFeeAssignment = require('../models/StudentFeeAssignment');
const CarryforwardEntry = require('../models/CarryforwardEntry');
const { createLedgerEntry } = require('../services/ledger.service');
const { PROMOTION_STATUS, PROMOTION_DECISION, ACADEMIC_STATUS, LEDGER_ENTRY_TYPE } = require('../config/constants');
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const d = await PromotionBatch.find({ organisationId: req.organisationId }).populate('fromAcademicYearId toAcademicYearId fromClassId toClassId').sort({ createdAt: -1 });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const d = await PromotionBatch.findById(req.params.id).populate('fromClassId toClassId fromAcademicYearId toAcademicYearId');
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

// Create promotion batch with student decisions
router.post('/', async (req, res, next) => {
  try {
    const batch = await PromotionBatch.create({ ...req.body, organisationId: req.organisationId, createdBy: req.user._id });
    res.status(201).json({ success: true, data: batch });
  } catch (e) { next(e); }
});

// Submit for approval
router.put('/:id/submit', async (req, res, next) => {
  try {
    const d = await PromotionBatch.findByIdAndUpdate(req.params.id, { status: PROMOTION_STATUS.SUBMITTED, submittedBy: req.user._id, submittedAt: new Date() }, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

// Approve
router.put('/:id/approve', async (req, res, next) => {
  try {
    const d = await PromotionBatch.findByIdAndUpdate(req.params.id, { status: PROMOTION_STATUS.APPROVED, approvedBy: req.user._id, approvedAt: new Date() }, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

// Apply promotion
router.put('/:id/apply', async (req, res, next) => {
  try {
    const batch = await PromotionBatch.findById(req.params.id);
    if (batch.status !== PROMOTION_STATUS.APPROVED) return res.status(400).json({ success: false, message: 'Batch must be approved.' });

    for (const decision of batch.decisions) {
      try {
        const student = await Student.findById(decision.studentId);
        if (!student) { decision.status = 'Failed'; decision.errorMessage = 'Student not found'; continue; }

        // Create academic history record
        await StudentAcademicHistory.create({
          studentId: student._id, academicYearId: batch.fromAcademicYearId,
          classId: decision.fromClassId || student.currentClassId,
          sectionId: decision.fromSectionId || student.currentSectionId,
          rollNumber: student.rollNumber, promotionDecision: decision.decision,
          promotionBatchId: batch._id,
        });

        if (decision.decision === PROMOTION_DECISION.PROMOTE) {
          student.currentClassId = decision.toClassId;
          student.currentSectionId = decision.toSectionId;
          student.currentAcademicYearId = batch.toAcademicYearId;
          student.rollNumber = decision.newRollNumber || '';
          student.academicStatus = ACADEMIC_STATUS.ACTIVE;
        } else if (decision.decision === PROMOTION_DECISION.HOLD) {
          student.currentAcademicYearId = batch.toAcademicYearId;
          student.academicStatus = ACADEMIC_STATUS.HELD;
        } else if (decision.decision === PROMOTION_DECISION.PASSED_OUT) {
          student.academicStatus = ACADEMIC_STATUS.PASSED_OUT;
        } else if (decision.decision === PROMOTION_DECISION.TRANSFER_OUT) {
          student.academicStatus = ACADEMIC_STATUS.TRANSFERRED;
        }
        await student.save();

        // Carryforward dues
        if (decision.carryforwardDue > 0) {
          await CarryforwardEntry.create({ studentId: student._id, fromAcademicYearId: batch.fromAcademicYearId, toAcademicYearId: batch.toAcademicYearId, promotionBatchId: batch._id, type: 'Due', amount: decision.carryforwardDue, organisationId: req.organisationId, createdBy: req.user._id });
          await createLedgerEntry({ studentId: student._id, academicYearId: batch.toAcademicYearId, entryType: LEDGER_ENTRY_TYPE.CARRYFORWARD_DUE, debitAmount: decision.carryforwardDue, sourceType: 'carryforward', sourceId: batch._id, particulars: `Carryforward Due from previous year`, createdBy: req.user._id, organisationId: req.organisationId });
        }

        decision.status = 'Applied';
      } catch (err) {
        decision.status = 'Failed';
        decision.errorMessage = err.message;
      }
    }

    batch.status = PROMOTION_STATUS.APPLIED;
    batch.appliedAt = new Date();
    await batch.save();
    res.json({ success: true, data: batch });
  } catch (e) { next(e); }
});

module.exports = router;
