import { ApiError } from '../utils/error.js';
export function notFound(_req,_res,next){next(new ApiError(404,'Route not found'));}
export function errorHandler(err,_req,res,_next){
  console.error(err);
  const status=err.status || (err.code === 'LIMIT_FILE_SIZE' ? 413 : 500);
  res.status(status).json({success:false,message:err.message || 'Internal server error',error:process.env.NODE_ENV==='production'?null:{name:err.name,details:err.details||null}});
}
