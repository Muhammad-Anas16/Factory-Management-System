import db from '../config/database.js';
export function rows(sql, params = []) { return db.prepare(sql).all(...params); }
export function row(sql, params = []) { return db.prepare(sql).get(...params); }
export function run(sql, params = []) { return db.prepare(sql).run(...params); }
