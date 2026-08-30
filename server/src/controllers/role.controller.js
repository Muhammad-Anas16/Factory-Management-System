import { asyncHandler } from '../utils/error.js';
import { ok } from '../utils/api.js';
import * as service from '../services/role.service.js';
import { audit } from '../utils/audit.js';
export const list=asyncHandler(async(_req,res)=>ok(res,{roles:service.listRoles()}));
export const create=asyncHandler(async(req,res)=>{const role=service.createRole(req.body);audit(req,'create','role',role.id,{name:role.name});return ok(res,{role},'Role created',201);});
export const update=asyncHandler(async(req,res)=>{const role=service.updateRole(req.params.id,req.body);audit(req,'update','role',Number(req.params.id));return ok(res,{role},'Role updated');});
export const remove=asyncHandler(async(req,res)=>{service.deleteRole(req.params.id);audit(req,'delete','role',Number(req.params.id));return ok(res,{},'Role deleted');});
