const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const FeeHead = require('../models/FeeHead');
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const d = await FeeHead.find({ organisationId: req.organisationId, isActive: true }).sort({ priority: 1 });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});
router.post('/', async (req, res, next) => {
  try {
    const d = await FeeHead.create({ ...req.body, organisationId: req.organisationId });
    res.status(201).json({ success: true, data: d });
  } catch (e) { next(e); }
});
router.put('/:id', async (req, res, next) => {
  try {
    const d = await FeeHead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    await FeeHead.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Fee head deactivated.' });
  } catch (e) { next(e); }
});
module.exports = router;
