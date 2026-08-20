import db from '../db/connection.js';

function toSafeUser(row) {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        role: row.role,
        isActive: !!row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

const userModel = {
    findByName(name) {
        return db.prepare('SELECT * FROM users WHERE name = ?').get(name);
    },

    findById(id) {
        return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    },

    create({ name, passwordHash, role }) {
        const result = db
            .prepare('INSERT INTO users (name, password_hash, role) VALUES (?, ?, ?)')
            .run(name, passwordHash, role);
        return userModel.findById(result.lastInsertRowid);
    },

    updateById(id, fields) {
        const allowed = ['name', 'password_hash', 'role', 'is_active'];
        const keys = Object.keys(fields).filter((k) => allowed.includes(k));
        if (keys.length === 0) return userModel.findById(id);

        const setClause = keys.map((k) => `${k} = @${k}`).join(', ');
        db.prepare(`UPDATE users SET ${setClause}, updated_at = datetime('now') WHERE id = @id`).run({
            ...fields,
            id,
        });
        return userModel.findById(id);
    },

    deleteById(id) {
        db.prepare('DELETE FROM users WHERE id = ?').run(id);
    },

    listAll() {
        return db.prepare('SELECT * FROM users ORDER BY id ASC').all();
    },

    countActiveAdmins(excludeId = null) {
        const row = excludeId
            ? db
                .prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin' AND is_active = 1 AND id != ?")
                .get(excludeId)
            : db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin' AND is_active = 1").get();
        return row.count;
    },

    toSafeUser,
};

export default userModel;