import { verifyToken } from '../utils/token.js';
import { ApiError } from '../utils/error.js';
import userModel from '../models/user.model.js';

export function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new ApiError(401, 'Authentication token is required');
    const payload = verifyToken(token);
    const user = userModel.findById(payload.id);
    if (!user || !user.is_active || !user.is_permission) throw new ApiError(401, 'User is inactive or does not exist');
    req.user = userModel.toAuthUser(user);
    next();
  } catch (err) {
    next(err instanceof ApiError ? err : new ApiError(401, 'Invalid or expired token'));
  }
}

export function requirePermission(page, action) {
  return (req, _res, next) => {
    try {
      if (!req.user) throw new ApiError(401, 'Authentication required');
      if (req.user.roleName === 'admin') return next();
      if (!req.user.permissions?.[page]?.[`can_${action}`]) {
        throw new ApiError(403, `Permission denied: ${action} on ${page}`);
      }
      next();
    } catch (err) { next(err); }
  };
}
