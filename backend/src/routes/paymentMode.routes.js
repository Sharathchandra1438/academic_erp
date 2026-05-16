const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const PaymentMode = require('../models/PaymentMode');
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const d = await PaymentMode.find({ organisationId: req.organisationId, isActive: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});
router.post('/', async (req, res, next) => {
  try {
    const d = await PaymentMode.create({ ...req.body, organisationId: req.organisationId });
    res.status(201).json({ success: true, data: d });
  } catch (e) { next(e); }
});
router.put('/:id', async (req, res, next) => {
  try {
    const d = await PaymentMode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});
module.exports = router;
