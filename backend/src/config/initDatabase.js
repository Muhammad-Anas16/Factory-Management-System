import { createUserTable } from "../model/user/user.model.js";
import { createWorkerTable } from "../model/worker/worker.model.js";
import { seedDefaultAdmin } from "./seedAdmin.js";

export const initializeDatabase = () => {
  console.log("🚀 Initializing Database...");
  createUserTable();
  createWorkerTable();
  seedDefaultAdmin();
  console.log("😎 Database Ready");
};