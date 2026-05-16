const AuditLog = require('../models/AuditLog');

const auditLog = (action, module) => async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = async (data) => {
    if (data && data.success !== false) {
      try {
        await AuditLog.create({
          userId: req.user?._id,
          userName: req.user?.name,
          action,
          module,
          recordId: data?.data?._id || req.params?.id,
          recordType: module,
          newValue: data?.data,
          reason: req.body?.reason,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          organisationId: req.organisationId,
          timestamp: new Date(),
        });
      } catch (e) {
        console.error('Audit log error:', e.message);
      }
    }
    return originalJson(data);
  };
  next();
};

const createAuditEntry = async ({ userId, userName, action, module, recordId, oldValue, newValue, reason, ip, organisationId }) => {
  try {
    await AuditLog.create({ userId, userName, action, module, recordId, oldValue, newValue, reason, ipAddress: ip, organisationId, timestamp: new Date() });
  } catch (e) {
    console.error('Audit log error:', e.message);
  }
};

module.exports = { auditLog, createAuditEntry };
