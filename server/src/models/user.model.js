import db from '../config/database.js';
import { parseJson, toJson } from '../utils/json.js';
import { fullPermissions, normalisePermissions } from '../constants/pages.js';

function rawById(id) {
  return db.prepare(`SELECT u.*, r.name AS role_name, r.description AS role_description, r.default_permissions FROM users u JOIN roles r ON r.id = u.role_id WHERE u.id = ?`).get(id);
}

function shape(row) {
  if (!row) return null;
  let permissions = normalisePermissions(parseJson(row.permissions, {}));
  if (row.role_name === 'admin') permissions = fullPermissions();
  return {
    id: row.id,
    username: row.username,
    roleId: row.role_id,
    isPermission: Boolean(row.is_permission),
    roleName: row.role_name,
    roleDescription: row.role_description,
    profilePicture: row.profile_picture,
    allowedPages: parseJson(row.allowed_pages, []),
    permissions,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const userModel = {
  findById: rawById,
  findByUsername: (username) => db.prepare(`SELECT u.*, r.name AS role_name, r.description AS role_description, r.default_permissions FROM users u JOIN roles r ON r.id = u.role_id WHERE lower(u.username) = lower(?)`).get(username),
  list: () => db.prepare(`SELECT u.*, r.name AS role_name, r.description AS role_description, r.default_permissions FROM users u JOIN roles r ON r.id = u.role_id ORDER BY u.id DESC`).all(),
  countActiveAdminsExcept: (id) => db.prepare(`SELECT COUNT(*) c FROM users u JOIN roles r ON r.id=u.role_id WHERE r.name='admin' AND u.is_active=1 AND u.id<>?`).get(id).c,
  create: ({ username, passwordHash, roleId, profilePicture = null, permissions = {}, allowedPages = [], isPermission = true }) => {
    const info = db.prepare(`INSERT INTO users (username,password_hash,role_id,is_permission,profile_picture,allowed_pages,permissions) VALUES (?,?,?,?,?,?,?)`)
      .run(username, passwordHash, roleId, isPermission ? 1 : 0, profilePicture, toJson(allowedPages), toJson(normalisePermissions(permissions)));
    return rawById(info.lastInsertRowid);
  },
  update: (id, fields) => {
    const keys = Object.keys(fields);
    if (!keys.length) return rawById(id);
    const map = { username:'username', passwordHash:'password_hash', roleId:'role_id', isPermission:'is_permission', profilePicture:'profile_picture', permissions:'permissions', allowedPages:'allowed_pages', isActive:'is_active' };
    const sets = keys.map((k) => `${map[k]}=?`).join(', ');
    const values = keys.map((k) => fields[k]);
    db.prepare(`UPDATE users SET ${sets}, updated_at=datetime('now') WHERE id=?`).run(...values, id);
    return rawById(id);
  },
  remove: (id) => db.prepare(`DELETE FROM users WHERE id=?`).run(id),
  toPublic: shape,
  toAuthUser: (row) => ({ ...shape(row), role: shape(row).roleName }),
};

export default userModel;
