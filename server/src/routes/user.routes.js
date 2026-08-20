import { Router } from 'express';
import {
    create,
    list,
    getById,
    update,
    updatePermissions,
    remove,
} from '../controllers/user.controller.js';
import { requireAuth, requirePermission } from '../middleware/auth.middleware.js';

const userRoutes = Router();

userRoutes.use(requireAuth);

userRoutes.post('/', requirePermission('users', 'create'), create);
userRoutes.get('/', requirePermission('users', 'view'), list);
userRoutes.get('/:id', requirePermission('users', 'view'), getById);
userRoutes.put('/:id', requirePermission('users', 'edit'), update);
userRoutes.put('/:id/permissions', requirePermission('users', 'edit'), updatePermissions);
userRoutes.delete('/:id', requirePermission('users', 'delete'), remove);

export default userRoutes;