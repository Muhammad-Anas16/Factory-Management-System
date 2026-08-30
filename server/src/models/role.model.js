import db from '../config/database.js';
import { parseJson, toJson } from '../utils/json.js';
import { normalisePermissions } from '../constants/pages.js';

const roleModel = {
  findById: (id) => db.prepare('SELECT * FROM roles WHERE id=?').get(id),
  findByName: (name) => db.prepare('SELECT * FROM roles WHERE lower(name)=lower(?)').get(name),
  list: () => db.prepare('SELECT * FROM roles ORDER BY is_system_role DESC, name ASC').all().map((r) => ({ ...r, is_system_role: Boolean(r.is_system_role), is_active: Boolean(r.is_active), default_permissions: normalisePermissions(parseJson(r.default_permissions, {})) })),
  create: ({ name, description, isSystemRole = false, defaultPermissions = {} }) => {
    const info = db.prepare('INSERT INTO roles (name,description,is_system_role,is_active,default_permissions) VALUES (?,?,?,?,?)').run(name, description || null, isSystemRole ? 1 : 0, 1, toJson(normalisePermissions(defaultPermissions)));
    return roleModel.findById(info.lastInsertRowid);
  },
  update: (id, fields) => {
    const keys = Object.keys(fields);
    if (!keys.length) return roleModel.findById(id);
    const map = { name:'name', description:'description', isActive:'is_active', defaultPermissions:'default_permissions' };
    const sets = keys.map((k) => `${map[k]}=?`).join(', ');
    const values = keys.map((k) => fields[k]);
    db.prepare(`UPDATE roles SET ${sets}, updated_at=datetime('now') WHERE id=?`).run(...values, id);
    return roleModel.findById(id);
  },
  remove: (id) => db.prepare('DELETE FROM roles WHERE id=?').run(id),
};
export default roleModel;
