import bcrypt from 'bcryptjs';
import userModel from '../models/user.model.js';
import permissionModel, { PAGES } from '../models/permission.model.js';
import ApiError from '../utils/ApiError.js';

function buildUserWithPermissions(userRow) {
    const safeUser = userModel.toSafeUser(userRow);
    const allowedPages = permissionModel.getAllowedPages(userRow.id);
    return { ...safeUser, allowedPages };
}

function validateAllowedPagesPayload(allowedPages) {
    if (!Array.isArray(allowedPages)) return [];
    return allowedPages.filter((item) => item && PAGES.includes(item.page));
}

const userService = {
    createUser({ name, password, role, allowedPages }) {
        if (!name || !password) {
            throw new ApiError(400, 'Name and password are required');
        }
        if (password.length < 6) {
            throw new ApiError(400, 'Password must be at least 6 characters');
        }

        const existing = userModel.findByName(name);
        if (existing) {
            throw new ApiError(409, 'A user with this name already exists');
        }

        const passwordHash = bcrypt.hashSync(password, 10);
        const userRow = userModel.create({
            name,
            passwordHash,
            role: role || 'karigar',
        });

        if (userRow.role === 'admin') {
            permissionModel.grantAll(userRow.id);
        } else {
            permissionModel.replaceForUser(userRow.id, validateAllowedPagesPayload(allowedPages));
        }

        return buildUserWithPermissions(userModel.findById(userRow.id));
    },

    listUsers() {
        return userModel.listAll().map((row) => buildUserWithPermissions(row));
    },

    getUserById(id) {
        const userRow = userModel.findById(id);
        if (!userRow) {
            throw new ApiError(404, 'User not found');
        }
        return buildUserWithPermissions(userRow);
    },

    updateUser(id, updates, actingUser) {
        const userRow = userModel.findById(id);
        if (!userRow) {
            throw new ApiError(404, 'User not found');
        }

        const fields = {};

        if (updates.name) fields.name = updates.name;

        if (updates.password) {
            if (updates.password.length < 6) {
                throw new ApiError(400, 'Password must be at least 6 characters');
            }
            fields.password_hash = bcrypt.hashSync(updates.password, 10);
        }

        if (updates.role && updates.role !== userRow.role) {
            if (actingUser.id === userRow.id && actingUser.role !== 'admin') {
                throw new ApiError(403, 'You cannot change your own role');
            }
            if (userRow.role === 'admin' && updates.role !== 'admin') {
                const otherAdmins = userModel.countActiveAdmins(userRow.id);
                if (otherAdmins === 0) {
                    throw new ApiError(400, 'Cannot remove the last active admin');
                }
            }
            fields.role = updates.role;
        }

        if (typeof updates.isActive === 'boolean') {
            if (actingUser.id === userRow.id && !updates.isActive) {
                throw new ApiError(403, 'You cannot deactivate your own account');
            }
            if (userRow.role === 'admin' && !updates.isActive) {
                const otherAdmins = userModel.countActiveAdmins(userRow.id);
                if (otherAdmins === 0) {
                    throw new ApiError(400, 'Cannot deactivate the last active admin');
                }
            }
            fields.is_active = updates.isActive ? 1 : 0;
        }

        const updatedRow = userModel.updateById(id, fields);

        if (fields.role === 'admin') {
            permissionModel.grantAll(updatedRow.id);
        }

        return buildUserWithPermissions(updatedRow);
    },

    updateUserPermissions(id, allowedPages, actingUser) {
        const userRow = userModel.findById(id);
        if (!userRow) {
            throw new ApiError(404, 'User not found');
        }

        if (actingUser.id === userRow.id && actingUser.role !== 'admin') {
            throw new ApiError(403, 'You cannot change your own permissions');
        }

        if (userRow.role === 'admin') {
            throw new ApiError(400, 'Admin users always have full permissions');
        }

        permissionModel.replaceForUser(id, validateAllowedPagesPayload(allowedPages));

        return buildUserWithPermissions(userModel.findById(id));
    },

    deleteUser(id, actingUser) {
        const userRow = userModel.findById(id);
        if (!userRow) {
            throw new ApiError(404, 'User not found');
        }

        if (actingUser.id === userRow.id) {
            throw new ApiError(403, 'You cannot delete your own account');
        }

        if (userRow.role === 'admin') {
            const otherAdmins = userModel.countActiveAdmins(userRow.id);
            if (otherAdmins === 0) {
                throw new ApiError(400, 'Cannot delete the last active admin');
            }
        }

        userModel.deleteById(id);
    },
};

export default userService;