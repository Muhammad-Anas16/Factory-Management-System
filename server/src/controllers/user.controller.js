import { asyncHandler } from '../utils/error.js';
import { ok } from '../utils/api.js';
import * as service from '../services/user.service.js';
import { audit } from '../utils/audit.js';
export const list=asyncHandler(async(_req,res)=>ok(res,{users:service.listUsers()}));
export const get=asyncHandler(async(req,res)=>ok(res,{user:service.getUser(req.params.id)}));
export const create=asyncHandler(async(req,res)=>{const user=service.createUser({...req.body,profilePicture:req.file?.filename}); audit(req,'create','user',user.id,{username:user.username}); return ok(res,{user},'User created',201);});
export const update=asyncHandler(async(req,res)=>{const user=service.updateUser(req.params.id,{...req.body,profilePicture:req.file?.filename ?? req.body.profilePicture},req.user); audit(req,'update','user',user.id); return ok(res,{user},'User updated');});
export const remove=asyncHandler(async(req,res)=>{service.deleteUser(req.params.id,req.user); audit(req,'delete','user',Number(req.params.id)); return ok(res,{},'User deleted');});
