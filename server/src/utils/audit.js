import db from '../config/database.js';
export function audit(req, action, entity, entityId = null, details = null) {
  db.prepare(`INSERT INTO audit_logs (user_id, action, entity, entity_id, details) VALUES (?, ?, ?, ?, ?)`)
    .run(req.user?.id ?? null, action, entity, entityId, details ? JSON.stringify(details) : null);
}
