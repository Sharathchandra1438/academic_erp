const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const PipelineTemplate = require('../models/PipelineTemplate');
const PipelineInstance = require('../models/PipelineInstance');

router.use(protect);

router.get('/templates', async (req, res, next) => {
  try {
    const d = await PipelineTemplate.find({ organisationId: req.organisationId });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.post('/templates', async (req, res, next) => {
  try {
    const d = await PipelineTemplate.create({ ...req.body, organisationId: req.organisationId, createdBy: req.user._id });
    res.status(201).json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.put('/templates/:id', async (req, res, next) => {
  try {
    const tmpl = await PipelineTemplate.findById(req.params.id);
    if (tmpl.lockedAt) {
      // Versioned edit: create new version
      const newVersion = await PipelineTemplate.create({
        ...req.body, name: tmpl.name, pipelineType: tmpl.pipelineType,
        version: tmpl.version + 1, organisationId: req.organisationId, updatedBy: req.user._id,
      });
      return res.json({ success: true, data: newVersion, message: 'New version created.' });
    }
    const d = await PipelineTemplate.findByIdAndUpdate(req.params.id, { ...req.body, updatedBy: req.user._id }, { new: true });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

// ── Pipeline Instances ──
router.get('/instances', async (req, res, next) => {
  try {
    const { referenceType, status } = req.query;
    const filter = { organisationId: req.organisationId };
    if (referenceType) filter.referenceType = referenceType;
    if (status) filter.status = status;
    const d = await PipelineInstance.find(filter).populate('templateId').sort({ createdAt: -1 });
    res.json({ success: true, data: d });
  } catch (e) { next(e); }
});

router.post('/instances', async (req, res, next) => {
  try {
    const tmpl = await PipelineTemplate.findById(req.body.templateId);
    if (!tmpl) return res.status(404).json({ success: false, message: 'Template not found.' });
    if (!tmpl.lockedAt) { tmpl.lockedAt = new Date(); await tmpl.save(); }
    const stages = tmpl.stages.map(s => ({
      stageName: s.stageName, stageOrder: s.stageOrder, status: 'Pending',
      checklist: (s.checklist || []).map(item => ({ item, checked: false })),
    }));
    const inst = await PipelineInstance.create({
      ...req.body, templateVersion: tmpl.version, stages,
      currentStageOrder: 1, currentStageName: stages[0]?.stageName,
      organisationId: req.organisationId,
    });
    res.status(201).json({ success: true, data: inst });
  } catch (e) { next(e); }
});

router.put('/instances/:id/advance', async (req, res, next) => {
  try {
    const inst = await PipelineInstance.findById(req.params.id);
    const currentStage = inst.stages.find(s => s.stageOrder === inst.currentStageOrder);
    if (currentStage) {
      currentStage.status = 'Completed';
      currentStage.completedAt = new Date();
      currentStage.completedBy = req.user._id;
      currentStage.notes = req.body.notes;
    }
    const nextStage = inst.stages.find(s => s.stageOrder === inst.currentStageOrder + 1);
    if (nextStage) {
      inst.currentStageOrder = nextStage.stageOrder;
      inst.currentStageName = nextStage.stageName;
      nextStage.status = 'In Progress';
      nextStage.startedAt = new Date();
    } else {
      inst.status = 'Completed';
      inst.completedAt = new Date();
    }
    await inst.save();
    res.json({ success: true, data: inst });
  } catch (e) { next(e); }
});

router.put('/instances/:id/override', async (req, res, next) => {
  try {
    const inst = await PipelineInstance.findById(req.params.id);
    const stage = inst.stages.find(s => s.stageOrder === inst.currentStageOrder);
    if (stage) {
      stage.status = 'Overridden';
      stage.isOverridden = true;
      stage.overrideReason = req.body.reason;
      stage.overriddenBy = req.user._id;
      stage.completedAt = new Date();
    }
    const nextStage = inst.stages.find(s => s.stageOrder === inst.currentStageOrder + 1);
    if (nextStage) { inst.currentStageOrder = nextStage.stageOrder; inst.currentStageName = nextStage.stageName; }
    else { inst.status = 'Completed'; inst.completedAt = new Date(); }
    await inst.save();
    res.json({ success: true, data: inst });
  } catch (e) { next(e); }
});

module.exports = router;
