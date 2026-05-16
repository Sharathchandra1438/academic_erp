// Role-based access control middleware
const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roleId) {
      return res.status(403).json({ success: false, message: 'Access denied. No role assigned.' });
    }

    const role = req.user.roleId;
    const userPermissions = (role.permissions || []).map(p => `${p.module}:${p.action}`);

    const hasPermission = requiredPermissions.every(perm => userPermissions.includes(perm));

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permissions: ${requiredPermissions.join(', ')}`,
      });
    }
    next();
  };
};

// Check if user is super admin (bypass all permission checks)
const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.roleId && req.user.roleId.name === 'Super Admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Super admin access required.' });
};

module.exports = { authorize, isSuperAdmin };
