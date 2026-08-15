import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { initializeDatabase } from "./src/config/initDatabase.js";
import userRoutes from "./src/routes/user/user.routes.js";
import workerRoutes from "./src/routes/worker/worker.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

initializeDatabase();

app.use("/api/users", userRoutes);
app.use("/api/workers", workerRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is online",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});