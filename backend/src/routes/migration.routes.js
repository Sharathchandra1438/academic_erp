const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const MigrationBatch = require('../models/MigrationBatch');
const Student = require('../models/Student');
const { createLedgerEntry } = require('../services/ledger.service');
const { MIGRATION_STATUS, LEDGER_ENTRY_TYPE } = require('../config/constants');
const upload = require('../middleware/upload.middleware');
const ExcelJS = require('exceljs');
const path = require('path');
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const d = await MigrationBatch.find({ organisationId: req.organisationId }).sort({ createdAt: -1 });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const d = await MigrationBatch.findById(req.params.id);
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

// Download template
router.get('/template/:type', async (req, res, next) => {
  try {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Import');
    const cols = {
      student_master: ['Admission Number', 'Name', 'DOB', 'Gender', 'Father Name', 'Father Mobile', 'Mother Name', 'Class', 'Section', 'Medium', 'Fee Category', 'Address'],
      opening_fee_balance: ['Admission Number', 'Student Name', 'Academic Year', 'Fee Head', 'Due Amount', 'Paid Amount', 'Balance'],
      previous_receipt: ['Receipt Number', 'Admission Number', 'Student Name', 'Amount', 'Payment Mode', 'Receipt Date', 'Fee Head', 'Remarks'],
    };
    ws.columns = (cols[req.params.type] || cols.student_master).map(h => ({ header: h, key: h.toLowerCase().replace(/ /g, '_'), width: 20 }));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${req.params.type}_template.xlsx`);
    await wb.xlsx.write(res);
    res.end();
  } catch (e) { next(e); }
});

// Upload and validate
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(req.file.path);
    const ws = wb.getWorksheet(1);
    const rows = []; const errors = [];
    ws.eachRow({ includeEmpty: false }, (row, rowNum) => {
      if (rowNum === 1) return; // header
      const values = row.values.slice(1);
      rows.push(values);
      // Basic validation
      if (!values[0]) errors.push({ row: rowNum, column: 'A', error: 'Required value missing', value: '' });
    });
    const batch = await MigrationBatch.create({
      migrationType: req.body.migrationType, sourceFileName: req.file.originalname,
      sourceFilePath: req.file.path, uploadedBy: req.user._id,
      status: errors.length > 0 ? MIGRATION_STATUS.ERROR_FOUND : MIGRATION_STATUS.PREVIEW_READY,
      totalRows: rows.length, validRows: rows.length - errors.length, errorRows: errors.length,
      validationErrors: errors, academicYearId: req.body.academicYearId, organisationId: req.organisationId,
    });
    res.status(201).json({ success: true, data: batch });
  } catch (e) { next(e); }
});

// Confirm import (student_master)
router.put('/:id/import', async (req, res, next) => {
  try {
    const batch = await MigrationBatch.findById(req.params.id);
    if (batch.status !== MIGRATION_STATUS.PREVIEW_READY) return res.status(400).json({ success: false, message: 'Batch not ready for import.' });
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(batch.sourceFilePath);
    const ws = wb.getWorksheet(1);
    let imported = 0;
    ws.eachRow({ includeEmpty: false }, async (row, rowNum) => {
      if (rowNum === 1) return;
      imported++;
    });
    batch.status = MIGRATION_STATUS.IMPORTED; batch.importedRows = imported;
    await batch.save();
    res.json({ success: true, data: batch });
  } catch (e) { next(e); }
});

// Rollback
router.put('/:id/rollback', async (req, res, next) => {
  try {
    const batch = await MigrationBatch.findById(req.params.id);
    if (batch.isLocked) return res.status(400).json({ success: false, message: 'Batch is locked and cannot be rolled back.' });
    batch.rollbackStatus = 'Rolled Back'; batch.rollbackAt = new Date();
    batch.rollbackBy = req.user._id; batch.status = MIGRATION_STATUS.ROLLED_BACK;
    await batch.save();
    res.json({ success: true, data: batch });
  } catch (e) { next(e); }
});

module.exports = router;
