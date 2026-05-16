const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const RepaymentMode = require('../models/RepaymentMode');
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const d = await RepaymentMode.find({ organisationId: req.organisationId, isActive: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});
router.post('/', async (req, res, next) => {
  try {
    const d = await RepaymentMode.create({ ...req.body, organisationId: req.organisationId });
    res.status(201).json({ success: true, data: d });
  } catch (e) { next(e); }
});
router.put('/:id', async (req, res, next) => {
  try {
    const d = await RepaymentMode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});
module.exports = router;
