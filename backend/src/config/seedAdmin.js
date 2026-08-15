import bcrypt from "bcryptjs";
import { findUserByUsername, registerUser } from "../model/user/user.model.js";

export const seedDefaultAdmin = () => {
  const existingAdmin = findUserByUsername(process.env.ADMIN_USERNAME);

  if (existingAdmin) {
    console.log("ℹ️  Default admin already exists. Skipping seed.");
    return;
  }

  const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

  registerUser({
    name: process.env.ADMIN_NAME || "Super Admin",
    username: process.env.ADMIN_USERNAME,
    password: hashedPassword,
    role: "admin",
    allowedPages: [
      "dashboard",
      "users",
      "workers",
      "articles",
      "reports",
      "settings",
    ],
    canAdd: 1,
    canEdit: 1,
    canDelete: 1,
  });

  console.log(
    `✅ Default admin created -> username: ${process.env.ADMIN_USERNAME}`,
  );
};
