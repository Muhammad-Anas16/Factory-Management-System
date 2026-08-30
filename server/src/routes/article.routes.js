import { Router } from 'express';
import { list,create,update,remove } from '../controllers/article.controller.js';
import { requireAuth,requirePermission } from '../middleware/auth.js';
import { uploadArticleImages } from '../middleware/upload.js';
const r=Router();r.use(requireAuth);r.get('/',requirePermission('articles','view'),list);r.post('/',requirePermission('articles','create'),uploadArticleImages.array('images',10),create);r.put('/:id',requirePermission('articles','edit'),uploadArticleImages.array('images',10),update);r.delete('/:id',requirePermission('articles','delete'),remove);export default r;
