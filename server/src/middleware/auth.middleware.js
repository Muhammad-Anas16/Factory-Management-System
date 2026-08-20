import jwt from 'jsonwebtoken';
import env from '../config/env.config.js';
import userModel from '../models/user.model.js';
import permissionModel from '../models/permission.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const requireAuth = asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
        throw new ApiError(401, 'Authentication token missing');
    }

    let payload;
    try {
        payload = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
        throw new ApiError(401, 'Invalid or expired token');
    }

    const userRow = userModel.findById(payload.id);
    if (!userRow || !userRow.is_active) {
        throw new ApiError(401, 'User not found or inactive');
    }

    req.user = {
        id: userRow.id,
        name: userRow.name,
        role: userRow.role,
        isActive: !!userRow.is_active,
        allowedPages: permissionModel.getAllowedPages(userRow.id),
        permissionMap: permissionModel.getPermissionMap(userRow.id),
    };

    next();
});

function requirePermission(page, action) {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, 'Authentication required'));
        }

        if (req.user.role === 'admin') {
            return next();
        }

        const pagePermission = req.user.permissionMap[page];
        const key = `can${action.charAt(0).toUpperCase()}${action.slice(1)}`;

        if (!pagePermission || !pagePermission[key]) {
            return next(new ApiError(403, `You do not have "${action}" permission on "${page}"`));
        }

        next();
    };
}

export { requireAuth, requirePermission };