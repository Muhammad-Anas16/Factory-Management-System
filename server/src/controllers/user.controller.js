import userService from '../services/user.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { success } from '../utils/apiResponse.js';

const create = asyncHandler(async (req, res) => {
    const { name, password, role, allowedPages } = req.body;
    const user = userService.createUser({ name, password, role, allowedPages });
    return success(res, { data: { user }, message: 'User created', statusCode: 201 });
});

const list = asyncHandler(async (req, res) => {
    const users = userService.listUsers();
    return success(res, { data: { users } });
});

const getById = asyncHandler(async (req, res) => {
    const user = userService.getUserById(req.params.id);
    return success(res, { data: { user } });
});

const update = asyncHandler(async (req, res) => {
    const user = userService.updateUser(req.params.id, req.body, req.user);
    return success(res, { data: { user }, message: 'User updated' });
});

const updatePermissions = asyncHandler(async (req, res) => {
    const user = userService.updateUserPermissions(req.params.id, req.body.allowedPages, req.user);
    return success(res, { data: { user }, message: 'Permissions updated' });
});

const remove = asyncHandler(async (req, res) => {
    userService.deleteUser(req.params.id, req.user);
    return success(res, { message: 'User deleted' });
});

export { create, list, getById, update, updatePermissions, remove };