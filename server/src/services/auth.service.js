import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/env.config.js';
import userModel from '../models/user.model.js';
import permissionModel from '../models/permission.model.js';
import ApiError from '../utils/ApiError.js';

function buildAuthUser(userRow) {
    const safeUser = userModel.toSafeUser(userRow);
    const allowedPages = permissionModel.getAllowedPages(userRow.id);
    return { ...safeUser, allowedPages };
}

function signToken(userId) {
    return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

const authService = {
    login(name, password) {
        const userRow = userModel.findByName(name);
        if (!userRow || !userRow.is_active) {
            throw new ApiError(401, 'Invalid username or password');
        }

        const matches = bcrypt.compareSync(password, userRow.password_hash);
        if (!matches) {
            throw new ApiError(401, 'Invalid username or password');
        }

        const token = signToken(userRow.id);
        const user = buildAuthUser(userRow);

        return { token, user };
    },

    getMe(userId) {
        const userRow = userModel.findById(userId);
        if (!userRow) {
            throw new ApiError(404, 'User not found');
        }
        return buildAuthUser(userRow);
    },
};

export default authService;