const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const AuditLog = require('../models/AuditLog');
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { module, action, userId, from, to, page = 1, limit = 50 } = req.query;
    const filter = { organisationId: req.organisationId };
    if (module) filter.module = module;
    if (action) filter.action = action;
    if (userId) filter.userId = userId;
    if (from || to) { filter.timestamp = {}; if (from) filter.timestamp.$gte = new Date(from); if (to) filter.timestamp.$lte = new Date(to); }
    const total = await AuditLog.countDocuments(filter);
    const d = await AuditLog.find(filter).sort({ timestamp: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, data: d, total });
  } catch (e) { next(e); }
});

module.exports = router;
