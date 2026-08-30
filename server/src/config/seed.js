import db from './database.js';
import env from './env.js';
import { hashPassword } from '../utils/password.js';
import { fullPermissions } from '../constants/pages.js';
import { toJson } from '../utils/json.js';

export function seedDefaults() {
  const roles = [
    { name:'admin', description:'Full system access', system:1, perms:fullPermissions() },
    { name:'supervisor', description:'Operational supervision', system:1, perms:{} },
    { name:'karigar', description:'Worker/karigar access', system:1, perms:{ 'work-completion':{can_view:true,can_create:true,can_edit:false,can_delete:false}, 'payments':{can_view:true,can_create:false,can_edit:false,can_delete:false} } },
    { name:'helper', description:'Helper access', system:1, perms:{ 'work-completion':{can_view:true,can_create:true,can_edit:false,can_delete:false} } },
  ];
  const insertRole=db.prepare(`INSERT OR IGNORE INTO roles (name,description,is_system_role,default_permissions) VALUES (?,?,?,?)`);
  for(const r of roles) insertRole.run(r.name,r.description,r.system,toJson(r.perms));
  const adminRole=db.prepare(`SELECT id FROM roles WHERE name='admin'`).get();
  const existing=db.prepare(`SELECT id FROM users WHERE lower(username)=lower(?)`).get(env.SEED_ADMIN_USERNAME);
  if(!existing){
    db.prepare(`INSERT INTO users (username,password_hash,role_id,is_permission,allowed_pages,permissions) VALUES (?,?,?,?,?,?)`).run(env.SEED_ADMIN_USERNAME,hashPassword(env.SEED_ADMIN_PASSWORD),adminRole.id,1,toJson(Object.keys(fullPermissions())),toJson(fullPermissions()));
    console.log(`[FMS] Seed admin created: ${env.SEED_ADMIN_USERNAME}`);
  }
  db.prepare(`INSERT OR IGNORE INTO settings(key,value) VALUES ('company_name','Factory Management System')`).run();
}
