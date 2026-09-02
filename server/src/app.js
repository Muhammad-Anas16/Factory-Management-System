import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "node:path";
import env from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import roleRoutes from "./routes/role.routes.js";
import articleRoutes from "./routes/article.routes.js";
import productionRoutes from "./routes/production.routes.js";
import workRoutes from "./routes/work.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import reportRoutes from "./routes/report.routes.js";
import pdfRoutes from "./routes/pdf.routes.js";
import payrollRoutes from "./routes/payroll.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import challanRoutes from "./routes/challan.routes.js";
import billRoutes from "./routes/bill.routes.js";
import backupRoutes from "./routes/backup.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { requireAuth, requirePermission } from "./middleware/auth.js";
import db from "./config/database.js";
import { ok } from "./utils/api.js";
import { asyncHandler } from "./utils/error.js";
import { PAGES } from "./constants/pages.js";

function moduleRoutes(page, table, displayName, options = {}) {
  const r = express.Router();
  r.use(requireAuth);
  const can = (a) => requirePermission(page, a);
  r.get(
    "/",
    can("view"),
    asyncHandler(async (_q, res) => {
      const data = db.prepare(`SELECT * FROM ${table} ORDER BY id DESC`).all();
      ok(res, { items: data });
    }),
  );
  r.post(
    "/",
    can("create"),
    asyncHandler(async (req, res) => {
      const cols = options.columns || [];
      const body = req.body || {};
      if (
        options.required?.some((k) => body[k] === undefined || body[k] === "")
      )
        throw Object.assign(
          new Error(`${displayName} requires: ${options.required.join(", ")}`),
          { status: 400 },
        );
      const fields = cols.filter((k) => body[k] !== undefined);
      const vals = fields.map((k) => body[k]);
      const sql = `INSERT INTO ${table} (${fields.join(",")}) VALUES (${fields.map(() => "?").join(",")})`;
      const info = db.prepare(sql).run(...vals);
      ok(res, { id: info.lastInsertRowid }, `${displayName} created`, 201);
    }),
  );
  r.put(
    "/:id",
    can("edit"),
    asyncHandler(async (req, res) => {
      const cols = options.columns || [];
      const fields = cols.filter((k) => req.body?.[k] !== undefined);
      if (!fields.length) return ok(res, {}, "Nothing to update");
      const sets = fields.map((k) => `${k}=?`).join(",");
      db.prepare(`UPDATE ${table} SET ${sets} WHERE id=?`).run(
        ...fields.map((k) => req.body[k]),
        req.params.id,
      );
      ok(res, {}, `${displayName} updated`);
    }),
  );
  r.delete(
    "/:id",
    can("delete"),
    asyncHandler(async (req, res) => {
      db.prepare(`DELETE FROM ${table} WHERE id=?`).run(req.params.id);
      ok(res, {}, `${displayName} deleted`);
    }),
  );
  return r;
}

export function createApp() {
  const app = express();
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cors({ origin: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan("dev"));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.use("/uploads", express.static(env.UPLOAD_DIR));
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Too many login attempts" },
  });
  app.use("/api/auth/login", loginLimiter);

  app.get("/api/health", (_req, res) =>
    ok(res, { status: "ok", time: new Date().toISOString() }),
  );
  app.get("/api/meta/pages", requireAuth, (_req, res) =>
    ok(res, { pages: PAGES }),
  );
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/roles", roleRoutes);
  app.use("/api/articles", articleRoutes);
  app.use("/api/production", productionRoutes);
  app.use("/api/work-allocations", workRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/pdf", pdfRoutes);

  app.use(
    "/api/categories",
    moduleRoutes("categories", "categories", "Category", {
      columns: ["name", "description", "is_active"],
      required: ["name"],
    }),
  );
  app.use(
    "/api/parties",
    moduleRoutes("parties", "parties", "Party", {
      columns: [
        "name",
        "contact_person",
        "phone",
        "address",
        "notes",
        "previous_balance",
        "is_active",
      ],
      required: ["name"],
    }),
  );
  app.use("/api/payroll", payrollRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use(
    "/api/audit-logs",
    moduleRoutes("audit-logs", "audit_logs", "Audit Log", {
      columns: ["user_id", "action", "entity", "entity_id", "details"],
      required: ["action", "entity"],
    }),
  );
  app.use("/api/challans", challanRoutes);
  app.use("/api/bills", billRoutes);
  app.use("/api/backup", backupRoutes);
  app.use(
    "/api/settings",
    moduleRoutes("settings", "settings", "Setting", {
      columns: ["key", "value"],
      required: ["key", "value"],
    }),
  );

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
