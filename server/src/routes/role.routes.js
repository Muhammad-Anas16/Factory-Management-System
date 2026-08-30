import { Router } from 'express';
import { list,create,update,remove } from '../controllers/role.controller.js';
import { requireAuth,requirePermission } from '../middleware/auth.js';
const r=Router(); r.use(requireAuth); r.get('/',requirePermission('roles','view'),list); r.post('/',requirePermission('roles','create'),create); r.put('/:id',requirePermission('roles','edit'),update); r.delete('/:id',requirePermission('roles','delete'),remove); export default r;
