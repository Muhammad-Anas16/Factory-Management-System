import { createUserTable } from "../model/user/user.model";
import { seedDefaultAdmin } from "./seedAdmin";

export const initializeDatabase = () => {
  console.log("🚀 Initializing Database...");
  createUserTable();
  seedDefaultAdmin();
  console.log("😎 Database Ready");
};
