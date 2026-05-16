const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const CandidateApplication = require('../models/CandidateApplication');
const CandidateDocument = require('../models/CandidateDocument');
const Student = require('../models/Student');
const { generateNumber } = require('../utils/numberSeries');
const { ADMISSION_STATUS, ACADEMIC_STATUS } = require('../config/constants');
const upload = require('../middleware/upload.middleware');

router.use(protect);

// Approve admission
router.put('/approve/:id', async (req, res, next) => {
  try {
    const app = await CandidateApplication.findByIdAndUpdate(req.params.id, {
      status: ADMISSION_STATUS.APPROVED, approvedAt: new Date(), approvedBy: req.user._id,
    }, { new: true });
    res.json({ success: true, data: app });
  } catch (e) { next(e); }
});

// Reject admission
router.put('/reject/:id', async (req, res, next) => {
  try {
    const app = await CandidateApplication.findByIdAndUpdate(req.params.id, {
      status: ADMISSION_STATUS.REJECTED, rejectedAt: new Date(), rejectedBy: req.user._id,
      rejectionReason: req.body.reason,
    }, { new: true });
    res.json({ success: true, data: app });
  } catch (e) { next(e); }
});

// Create student from approved application
router.post('/create-student/:applicationId', async (req, res, next) => {
  try {
    const app = await CandidateApplication.findById(req.params.applicationId);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });
    if (app.status !== ADMISSION_STATUS.APPROVED) return res.status(400).json({ success: false, message: 'Application must be approved first.' });

    const admissionNumber = await generateNumber({ organisationId: req.organisationId, module: 'student', academicYearId: app.academicYearId });

    const student = await Student.create({
      admissionNumber, name: app.candidateName, dob: app.dob, gender: app.gender, photo: app.photo,
      guardians: [{ relation: 'Father', name: app.parentName, phone: app.parentMobile, email: app.parentEmail, isPrimary: true }],
      currentAcademicYearId: app.academicYearId, currentClassId: app.interestedClass,
      currentSectionId: app.interestedSection, mediumId: app.medium, feeCategoryId: app.feeCategory,
      academicStatus: ACADEMIC_STATUS.ADMITTED, applicationId: app._id,
      admissionDate: new Date(), organisationId: req.organisationId, createdBy: req.user._id,
      ...req.body, // any extra fields from form
    });

    await CandidateApplication.findByIdAndUpdate(app._id, { status: ADMISSION_STATUS.ADMITTED, studentId: student._id, admittedAt: new Date() });

    res.status(201).json({ success: true, data: student });
  } catch (e) { next(e); }
});

// Upload document
router.post('/documents', upload.single('document'), async (req, res, next) => {
  try {
    const doc = await CandidateDocument.create({
      applicationId: req.body.applicationId, documentName: req.body.documentName,
      requirementId: req.body.requirementId, filePath: req.file.path,
      fileType: req.file.mimetype, fileSizeKB: Math.round(req.file.size / 1024),
      uploadedBy: req.user._id,
    });
    res.status(201).json({ success: true, data: doc });
  } catch (e) { next(e); }
});

// Verify document
router.put('/documents/:id/verify', async (req, res, next) => {
  try {
    const d = await CandidateDocument.findByIdAndUpdate(req.params.id, { status: 'Verified', verifiedBy: req.user._id, verifiedAt: new Date() }, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

// Reject document
router.put('/documents/:id/reject', async (req, res, next) => {
  try {
    const d = await CandidateDocument.findByIdAndUpdate(req.params.id, { status: 'Rejected', rejectionReason: req.body.reason, verifiedBy: req.user._id, verifiedAt: new Date() }, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

// Get documents for application
router.get('/documents/:applicationId', async (req, res, next) => {
  try {
    const d = await CandidateDocument.find({ applicationId: req.params.applicationId });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

module.exports = router;
