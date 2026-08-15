import db from "../../config/db.js";

export const createWorkerTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workerId TEXT UNIQUE,
      name TEXT NOT NULL,
      category TEXT,
      workerType TEXT,
      phone TEXT,
      address TEXT,
      joiningDate TEXT,
      salaryType TEXT,
      salaryAmount REAL DEFAULT 0,
      perPieceRate REAL DEFAULT 0,
      profilePhoto TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;
    db.exec(sql);
    console.log("Worker Table Created Successfully!");
};

export const registerWorker = (worker) => {
    const insertStatement = db.prepare(`
    INSERT INTO workers (
      name, category, workerType, phone, address, joiningDate,
      salaryType, salaryAmount, perPieceRate, notes, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    const info = insertStatement.run(
        worker.name,
        worker.category || null,
        worker.workerType || null,
        worker.phone || null,
        worker.address || null,
        worker.joiningDate || null,
        worker.salaryType || null,
        worker.salaryAmount || 0,
        worker.perPieceRate || 0,
        worker.notes || null,
        worker.status || "active",
    );

    const workerId = `WRK-${String(info.lastInsertRowid).padStart(4, "0")}`;

    db.prepare(`UPDATE workers SET workerId = ? WHERE id = ?`).run(workerId, info.lastInsertRowid);

    return { id: info.lastInsertRowid, workerId };
};

export const findWorkerById = (id) => {
    const statement = db.prepare("SELECT * FROM workers WHERE id = ?");
    return statement.get(id);
};

export const getAllWorkers = () => {
    const statement = db.prepare("SELECT * FROM workers ORDER BY id DESC");
    return statement.all();
};

export const updateWorker = (worker) => {
    const statement = db.prepare(`
    UPDATE workers
    SET name = ?,
        category = ?,
        workerType = ?,
        phone = ?,
        address = ?,
        joiningDate = ?,
        salaryType = ?,
        salaryAmount = ?,
        perPieceRate = ?,
        notes = ?,
        status = ?,
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
    return statement.run(
        worker.name,
        worker.category,
        worker.workerType,
        worker.phone,
        worker.address,
        worker.joiningDate,
        worker.salaryType,
        worker.salaryAmount,
        worker.perPieceRate,
        worker.notes,
        worker.status,
        worker.id,
    );
};