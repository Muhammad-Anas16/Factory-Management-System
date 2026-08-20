import authService from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { success } from '../utils/apiResponse.js';
import ApiError from '../utils/ApiError.js';

const login = asyncHandler(async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        throw new ApiError(400, 'Name and password are required');
    }
    const result = authService.login(name, password);
    return success(res, { data: result, message: 'Login successful' });
});

const me = asyncHandler(async (req, res) => {
    const user = authService.getMe(req.user.id);
    return success(res, { data: { user } });
});

const logout = asyncHandler(async (req, res) => {
    return success(res, { message: 'Logged out successfully' });
});

export { login, me, logout };