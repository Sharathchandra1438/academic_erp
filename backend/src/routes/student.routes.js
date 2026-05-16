const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Student = require('../models/Student');
const StudentAcademicHistory = require('../models/StudentAcademicHistory');
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { classId, sectionId, academicStatus, academicYearId, search, page = 1, limit = 20 } = req.query;
    const filter = { organisationId: req.organisationId };
    if (classId) filter.currentClassId = classId;
    if (sectionId) filter.currentSectionId = sectionId;
    if (academicStatus) filter.academicStatus = academicStatus;
    if (academicYearId) filter.currentAcademicYearId = academicYearId;
    if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { admissionNumber: new RegExp(search, 'i') }];
    const total = await Student.countDocuments(filter);
    const d = await Student.find(filter).populate('currentClassId currentSectionId mediumId feeCategoryId')
      .sort({ name: 1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, data: d, total });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const d = await Student.findById(req.params.id).populate('currentClassId currentSectionId mediumId feeCategoryId currentAcademicYearId');
    const history = await StudentAcademicHistory.find({ studentId: req.params.id }).populate('classId sectionId academicYearId').sort({ createdAt: -1 });
    res.json({ success: true, data: { student: d, academicHistory: history } });
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const d = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

module.exports = router;
