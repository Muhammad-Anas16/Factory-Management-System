import bcrypt from "bcryptjs";
import { createUser, findUserByUsername } from "../model/user/user.model.js";

export const seedDefaultAdmin = () => {
  const existingAdmin = findUserByUsername(process.env.ADMIN_USERNAME);

  if (existingAdmin) {
    console.log("⚡ Default admin already exists. Skipping seed.");
  }

  const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 22);

  const allPages = JSON.stringify([
    "dashboard",
    "users",
    "workers",
    "articles",
    "reports",
    "settings",
  ]);

  createUser({
    name: process.env.ADMIN_NAME || "Super Admin",
    username: process.env.ADMIN_USERNAME,
    password: hashedPassword,
    role: "admin",
    allowedPages: allPages,
    canAdd: 1,
    canEdit: 1,
    canDelete: 1,
  });

  console.log(
    `⚡ Default admin created -> username: ${process.env.ADMIN_USERNAME}`,
  );
};
