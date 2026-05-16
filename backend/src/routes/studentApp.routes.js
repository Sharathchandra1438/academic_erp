const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const StudentFeeAssignment = require('../models/StudentFeeAssignment');
const StudentLedgerEntry = require('../models/StudentLedgerEntry');
const Receipt = require('../models/Receipt');
const Notice = require('../models/Notice');
const BonafideRequest = require('../models/BonafideRequest');
const bcrypt = require('bcryptjs');

// Student login (separate from admin)
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const student = await Student.findOne({ loginUsername: username, loginEnabled: true });
    if (!student) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    const isMatch = await bcrypt.compare(password, student.loginPasswordHash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    const token = jwt.sign({ id: student._id, type: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, data: { student, token } });
  } catch (e) { next(e); }
});

// Middleware for student auth
const studentAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'student') return res.status(403).json({ success: false, message: 'Not a student token.' });
    req.student = await Student.findById(decoded.id).populate('currentClassId currentSectionId');
    if (!req.student) return res.status(404).json({ success: false, message: 'Student not found.' });
    next();
  } catch (e) { return res.status(401).json({ success: false, message: 'Invalid token.' }); }
};

router.get('/profile', studentAuth, async (req, res) => {
  res.json({ success: true, data: req.student });
});

router.get('/fee-summary', studentAuth, async (req, res, next) => {
  try {
    const d = await StudentFeeAssignment.find({ studentId: req.student._id, isActive: true }).populate('repaymentModeId');
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.get('/ledger', studentAuth, async (req, res, next) => {
  try {
    const d = await StudentLedgerEntry.find({ studentId: req.student._id }).sort({ createdAt: 1 });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.get('/receipts', studentAuth, async (req, res, next) => {
  try {
    const d = await Receipt.find({ studentId: req.student._id, status: 'Generated' }).sort({ receiptDate: -1 });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.get('/notices', studentAuth, async (req, res, next) => {
  try {
    const d = await Notice.find({
      organisationId: req.student.organisationId, isPublished: true,
      $or: [{ targetAudience: 'All' }, { targetAudience: 'Students' }, { classIds: req.student.currentClassId }],
    }).sort({ publishedAt: -1 }).limit(20);
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.get('/bonafide', studentAuth, async (req, res, next) => {
  try {
    const d = await BonafideRequest.find({ studentId: req.student._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.post('/bonafide', studentAuth, async (req, res, next) => {
  try {
    const d = await BonafideRequest.create({ ...req.body, studentId: req.student._id, requestedBy: 'Student', organisationId: req.student.organisationId });
    res.status(201).json({ success: true, data: d });
  } catch (e) { next(e); }
});

module.exports = router;
