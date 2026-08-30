import { asyncHandler } from '../utils/error.js';
import { ok } from '../utils/api.js';
import { login } from '../services/auth.service.js';
export const loginController = asyncHandler(async (req,res)=>ok(res,login(req.body.username,req.body.password),'Login successful'));
export const meController = asyncHandler(async (req,res)=>ok(res,{user:req.user}));
export const logoutController = asyncHandler(async (_req,res)=>ok(res,{},'Logout successful'));
