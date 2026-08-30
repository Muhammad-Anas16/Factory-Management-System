import roleModel from '../models/role.model.js';
import { ApiError } from '../utils/error.js';
import { normalisePermissions } from '../constants/pages.js';
import db from '../config/database.js';
export function listRoles() { return roleModel.list(); }
export function createRole(input) {
  if (!input.name?.trim()) throw new ApiError(400, 'Role name is required');
  if (roleModel.findByName(input.name.trim())) throw new ApiError(409, 'Role already exists');
  return roleModel.create({ name: input.name.trim(), description: input.description, defaultPermissions: input.defaultPermissions || {} });
}
export function updateRole(id, input) {
  const role = roleModel.findById(id); if (!role) throw new ApiError(404,'Role not found');
  if (role.is_system_role && input.name && input.name !== role.name) throw new ApiError(400,'System role name cannot be changed');
  const fields={};
  if(input.name!==undefined) fields.name=input.name.trim();
  if(input.description!==undefined) fields.description=input.description;
  if(input.isActive!==undefined) fields.isActive=input.isActive?1:0;
  if(input.defaultPermissions!==undefined) fields.defaultPermissions=JSON.stringify(normalisePermissions(input.defaultPermissions));
  return roleModel.update(id,fields);
}
export function deleteRole(id) {
  const role=roleModel.findById(id); if(!role) throw new ApiError(404,'Role not found');
  if(role.is_system_role) throw new ApiError(400,'System roles cannot be deleted');
  const users=db.prepare('SELECT COUNT(*) c FROM users WHERE role_id=?').get(id).c;
  if(users>0) throw new ApiError(400,'Role is assigned to users and cannot be deleted');
  roleModel.remove(id);
}
