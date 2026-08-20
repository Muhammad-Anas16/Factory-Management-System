import { Router } from 'express';
import { login, me, logout } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const authRoutes = Router();

authRoutes.post('/login', login);
authRoutes.get('/me', requireAuth, me);
authRoutes.post('/logout', requireAuth, logout);

export default authRoutes;