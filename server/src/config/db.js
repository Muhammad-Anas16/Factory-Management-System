import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import env from './env.config.js';

const dbPath = path.resolve(process.cwd(), env.DATABASE_PATH);
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default db;