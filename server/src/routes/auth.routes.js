import { Router } from 'express';
import { loginController, meController, logoutController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
const r=Router(); r.post('/login',loginController); r.get('/me',requireAuth,meController); r.post('/logout',requireAuth,logoutController); export default r;
