import { createUserTable } from "../model/user/user.model.js";
import { seedDefaultAdmin } from "./seedAdmin.js";

export const initializeDatabase = () => {
  console.log("🚀 Initializing Database...");
  createUserTable();
  seedDefaultAdmin();
  console.log("😎 Database Ready");
};
