import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { initializeDatabase } from "./src/consfig/initDatabase.js";
import userRoutes from "./src/routes/user.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

initializeDatabase();

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Factory Management System API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});