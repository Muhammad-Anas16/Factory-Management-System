import bcrypt from 'bcryptjs';
import userModel from '../models/user.model.js';
import roleModel from '../models/role.model.js';
import { ApiError } from '../utils/error.js';
import { allowedPagesFromPermissions, normalisePermissions } from '../constants/pages.js';
import { parseJson } from '../utils/json.js';

function assertUniqueUsername(username, id = null) {
  const existing = userModel.findByUsername(username);
  if (existing && existing.id !== Number(id)) throw new ApiError(409, 'Username already exists');
}

export function listUsers() { return userModel.list().map(userModel.toPublic); }
export function getUser(id) {
  const row = userModel.findById(id);
  if (!row) throw new ApiError(404, 'User not found');
  return userModel.toPublic(row);
}

function parseRoleDefaults(role) { return parseJson(role?.default_permissions, {}); }

export function createUser(input) {
  const { username, password, roleId, profilePicture, permissions = {} } = input;
  if (!username || !password || !roleId) throw new ApiError(400, 'Username, password and role are required');
  if (password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');
  assertUniqueUsername(username);
  const role = roleModel.findById(roleId);
  if (!role || !role.is_active) throw new ApiError(400, 'Selected role is invalid or inactive');
  let rawPermissions = permissions;
  if (typeof rawPermissions === 'string') { try { rawPermissions = JSON.parse(rawPermissions); } catch { rawPermissions = {}; } }
  const normalizedInput = normalisePermissions(rawPermissions);
  const roleDefaults = normalisePermissions(parseRoleDefaults(role));
  const hasExplicitPermissions = Object.values(normalizedInput).some((p) => Object.values(p).some(Boolean));
  const normalized = hasExplicitPermissions ? normalizedInput : roleDefaults;
  const perms = role.name === 'admin' ? normalisePermissions(Object.fromEntries(Object.keys(normalized).map((p)=>[p,{can_view:true,can_create:true,can_edit:true,can_delete:true}]))) : normalized;
  const created = userModel.create({ username: username.trim(), passwordHash: bcrypt.hashSync(password, 12), roleId: Number(roleId), profilePicture: profilePicture || null, permissions: perms, allowedPages: allowedPagesFromPermissions(perms), isPermission: true });
  return userModel.toPublic(created);
}

export function updateUser(id, input, actingUser) {
  const existing = userModel.findById(id);
  if (!existing) throw new ApiError(404, 'User not found');
  const targetRole = input.roleId != null ? roleModel.findById(input.roleId) : roleModel.findById(existing.role_id);
  if (!targetRole || !targetRole.is_active) throw new ApiError(400, 'Selected role is invalid or inactive');
  if (input.username !== undefined) { assertUniqueUsername(input.username, id); }
  if (actingUser.id === Number(id) && input.isActive === false) throw new ApiError(400, 'You cannot deactivate your own account');
  const currentRole = existing.role_name;
  const targetRoleName = targetRole.name;
  if (currentRole === 'admin' && targetRoleName !== 'admin' && userModel.countActiveAdminsExcept(id) === 0) throw new ApiError(400, 'Cannot remove the last active admin');
  if (currentRole === 'admin' && input.isActive === false && userModel.countActiveAdminsExcept(id) === 0) throw new ApiError(400, 'Cannot deactivate the last active admin');
  const fields = {};
  if (input.username !== undefined) fields.username = String(input.username).trim();
  if (input.password) {
    if (input.password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');
    fields.passwordHash = bcrypt.hashSync(input.password, 12);
  }
  if (input.roleId !== undefined) fields.roleId = Number(input.roleId);
  if (input.profilePicture !== undefined) fields.profilePicture = input.profilePicture;
  if (input.permissions !== undefined) {
    let raw = input.permissions;
    if (typeof raw === 'string') { try { raw = JSON.parse(raw); } catch { raw = {}; } }
    fields.permissions = normalisePermissions(raw);
  }
  if (input.isActive !== undefined) fields.isActive = input.isActive ? 1 : 0;
  if (input.isPermission !== undefined) fields.isPermission = input.isPermission ? 1 : 0;
  if (input.permissions !== undefined) fields.allowedPages = allowedPagesFromPermissions(normalisePermissions(typeof input.permissions === 'string' ? (()=>{try{return JSON.parse(input.permissions)}catch{return {}}})() : input.permissions));
  else if (targetRoleName === 'admin') fields.allowedPages = allowedPagesFromPermissions(normalizedFull());
  const updated = userModel.update(id, fields);
  return userModel.toPublic(updated);
}

function normalizedFull() { return Object.fromEntries(Object.keys(normalisePermissions({})).map((p)=>[p,{can_view:true,can_create:true,can_edit:true,can_delete:true}])); }

export function deleteUser(id, actingUser) {
  const existing = userModel.findById(id);
  if (!existing) throw new ApiError(404, 'User not found');
  if (actingUser.id === Number(id)) throw new ApiError(400, 'You cannot delete your own account');
  if (existing.role_name === 'admin' && userModel.countActiveAdminsExcept(id) === 0) throw new ApiError(400, 'Cannot delete the last active admin');
  userModel.remove(id);
}
