import * as s from '../services/production.service.js';import {asyncHandler} from '../utils/error.js';import {ok} from '../utils/api.js';import {audit} from '../utils/audit.js';
export const list=asyncHandler(async(_q,res)=>ok(res,{items:s.list()}));
export const create=asyncHandler(async(req,res)=>{const id=s.create(req.body,req.user.id);audit(req,'create','production',id);ok(res,{id},'Production created',201)});
export const update=asyncHandler(async(req,res)=>{s.update(req.params.id,req.body);audit(req,'update','production',Number(req.params.id));ok(res,{},'Production updated')});
export const remove=asyncHandler(async(req,res)=>{s.remove(req.params.id);audit(req,'delete','production',Number(req.params.id));ok(res,{},'Production deleted')});
