import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const dbFolder = path.join(_dirname, "../database");
if (!fs.existsSync) {
  fs.mkdirSync(dbFolder, { recursive: true });
}

const dbPath = path.join(dbFolder, "factory.db");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export default db;
