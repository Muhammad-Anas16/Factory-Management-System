import * as model from '../models/article.model.js';
import { asyncHandler, ApiError } from '../utils/error.js';
import { ok } from '../utils/api.js';
import { audit } from '../utils/audit.js';
export const list=asyncHandler(async(_q,res)=>ok(res,{articles:model.list()}));
export const create=asyncHandler(async(req,res)=>{if(!req.body.name)throw new ApiError(400,'Article name is required');const paths=(req.files||[]).map(f=>`/uploads/articles/${f.filename}`);const a=model.create(req.body,paths);audit(req,'create','article',a.id,{name:a.name});ok(res,{article:a},'Article created',201);});
export const update=asyncHandler(async(req,res)=>{const paths=req.files?req.files.map(f=>`/uploads/articles/${f.filename}`):undefined;const a=model.update(req.params.id,req.body,paths);if(!a)throw new ApiError(404,'Article not found');audit(req,'update','article',a.id);ok(res,{article:a},'Article updated');});
export const remove=asyncHandler(async(req,res)=>{model.remove(req.params.id);audit(req,'delete','article',Number(req.params.id));ok(res,{},'Article deleted');});
