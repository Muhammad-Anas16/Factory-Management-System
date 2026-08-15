import db from "../../config/db.js";

export const createUserTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      allowedPages TEXT NOT NULL DEFAULT '[]',
      canAdd INTEGER NOT NULL DEFAULT 0,
      canEdit INTEGER NOT NULL DEFAULT 0,
      canDelete INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;
  db.exec(sql);
  console.log("User Table Created Successfully!");
};

export const registerUser = (user) => {
  const statement = db.prepare(`
    INSERT INTO users (
      name, username, password, role, allowedPages, canAdd, canEdit, canDelete, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return statement.run(
    user.name,
    user.username,
    user.password,
    user.role || "user",
    JSON.stringify(user.allowedPages || []), // 🔧 fix: array ko JSON string me convert kiya
    user.canAdd ? 1 : 0,
    user.canEdit ? 1 : 0,
    user.canDelete ? 1 : 0,
    user.status || "active",
  );
};

export const findUserByUsername = (username) => {
  const statement = db.prepare("SELECT * FROM users WHERE username = ?");
  return statement.get(username);
};

export const findUserById = (id) => {
  const statement = db.prepare("SELECT * FROM users WHERE id = ?");
  return statement.get(id);
};

export const getAllUsers = () => {
  const statement = db.prepare(
    "SELECT id, name, username, role, allowedPages, canAdd, canEdit, canDelete, status, createdAt, updatedAt FROM users ORDER BY id DESC",
  );
  return statement.all();
};

export const updateUser = (user) => {
  const statement = db.prepare(`
    UPDATE users
    SET name = ?,
        username = ?,
        role = ?,
        allowedPages = ?,
        canAdd = ?,
        canEdit = ?,
        canDelete = ?,
        status = ?,
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `); // 🔧 fix: parens hataye, WHERE clause bahar nikala
  return statement.run(
    user.name,
    user.username,
    user.role || "user",
    JSON.stringify(user.allowedPages || []),
    user.canAdd ? 1 : 0,
    user.canEdit ? 1 : 0,
    user.canDelete ? 1 : 0,
    user.status || "active",
    user.id, // 🔧 fix: id missing thi, ab add ki
  );
};

export const updateUserPassword = (id, hashedPassword) => {
  const statement = db.prepare(`
    UPDATE users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?
  `); // 🔧 fix: WHERE id = ? (column name likha)
  return statement.run(hashedPassword, id);
};

export const deleteUser = (id) => {
  const statement = db.prepare(`DELETE FROM users WHERE id = ?`);
  return statement.run(id);
};
