import bcrypt from "bcryptjs";
import {
  registerUser,
  findUserByUsername,
  findUserById,
  getAllUsers,
  updateUser,
  updateUserPassword,
  deleteUser,
} from "../model/user/user.model.js";
import { generateToken } from "../helper/token.helper.js";
import { successResponse, errorResponse } from "../helper/response.helper.js";

const toSafeUser = (user) => {
  const { password, ...safeUser } = user;
  safeUser.allowedPages = JSON.parse(safeUser.allowedPages || "[]");
  return safeUser;
};

export const login = (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return errorResponse(res, "Username and password are required.", null, 400);
    }

    const user = findUserByUsername(username);
    if (!user) return errorResponse(res, "Invalid username or password.", null, 401);
    if (user.status !== "active") return errorResponse(res, "Account is disabled. Contact admin.", null, 403);

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return errorResponse(res, "Invalid username or password.", null, 401);

    const token = generateToken({ id: user.id, role: user.role });
    return successResponse(res, "Login successful.", { token, user: toSafeUser(user) });
  } catch (err) {
    return errorResponse(res, "Login failed.", err.message, 500);
  }
};

export const createUser = (req, res) => {
  try {
    const { name, username, password, role, allowedPages, canAdd, canEdit, canDelete } = req.body;

    if (!name || !username || !password) {
      return errorResponse(res, "Name, username and password are required.", null, 400);
    }
    if (password.length < 6) {
      return errorResponse(res, "Password must be at least 6 characters.", null, 400);
    }
    if (findUserByUsername(username)) {
      return errorResponse(res, "Username already taken.", null, 409);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const info = registerUser({
      name,
      username,
      password: hashedPassword,
      role: role || "user",
      allowedPages: allowedPages || [],
      canAdd,
      canEdit,
      canDelete,
    });

    return successResponse(res, "User created successfully.", { id: info.lastInsertRowid }, 201);
  } catch (err) {
    return errorResponse(res, "Failed to create user.", err.message, 500);
  }
};

export const getUsers = (req, res) => {
  try {
    const users = getAllUsers().map((u) => ({ ...u, allowedPages: JSON.parse(u.allowedPages || "[]") }));
    return successResponse(res, "Users fetched successfully.", users);
  } catch (err) {
    return errorResponse(res, "Failed to fetch users.", err.message, 500);
  }
};

export const getSingleUser = (req, res) => {
  try {
    const user = findUserById(req.params.id);
    if (!user) return errorResponse(res, "User not found.", null, 404);
    return successResponse(res, "User fetched successfully.", toSafeUser(user));
  } catch (err) {
    return errorResponse(res, "Failed to fetch user.", err.message, 500);
  }
};

export const getMyProfile = (req, res) => {
  try {
    const user = { ...req.user };
    user.allowedPages = JSON.parse(user.allowedPages || "[]");
    return successResponse(res, "Profile fetched successfully.", user);
  } catch (err) {
    return errorResponse(res, "Failed to fetch profile.", err.message, 500);
  }
};

// Admin: role/pages/authority/status ek sath update
export const editUser = (req, res) => {
  try {
    const { id } = req.params;
    const existing = findUserById(id);
    if (!existing) return errorResponse(res, "User not found.", null, 404);

    const {
      name = existing.name,
      username = existing.username,
      role = existing.role,
      allowedPages = JSON.parse(existing.allowedPages || "[]"),
      canAdd = existing.canAdd,
      canEdit = existing.canEdit,
      canDelete = existing.canDelete,
      status = existing.status,
    } = req.body;

    if (username !== existing.username && findUserByUsername(username)) {
      return errorResponse(res, "Username already taken.", null, 409);
    }

    updateUser({ id, name, username, role, allowedPages, canAdd, canEdit, canDelete, status });
    return successResponse(res, "User updated successfully.");
  } catch (err) {
    return errorResponse(res, "Failed to update user.", err.message, 500);
  }
};

// Khud apna password change (purana password verify hoke)
export const changeMyPassword = (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return errorResponse(res, "Old and new password are required.", null, 400);
    }
    if (newPassword.length < 6) {
      return errorResponse(res, "New password must be at least 6 characters.", null, 400);
    }

    const user = findUserById(req.user.id);
    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) return errorResponse(res, "Old password is incorrect.", null, 401);

    const hashed = bcrypt.hashSync(newPassword, 10);
    updateUserPassword(user.id, hashed);
    return successResponse(res, "Password changed successfully.");
  } catch (err) {
    return errorResponse(res, "Failed to change password.", err.message, 500);
  }
};

// Admin: kisi aur ka password reset (bina purana pata hue)
export const resetUserPassword = (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return errorResponse(res, "New password must be at least 6 characters.", null, 400);
    }

    const user = findUserById(id);
    if (!user) return errorResponse(res, "User not found.", null, 404);

    const hashed = bcrypt.hashSync(newPassword, 10);
    updateUserPassword(id, hashed);
    return successResponse(res, "Password reset successfully.");
  } catch (err) {
    return errorResponse(res, "Failed to reset password.", err.message, 500);
  }
};

export const removeUser = (req, res) => {
  try {
    const { id } = req.params;
    const user = findUserById(id);
    if (!user) return errorResponse(res, "User not found.", null, 404);
    if (user.role === "admin") return errorResponse(res, "Default admin cannot be deleted.", null, 403);

    deleteUser(id);
    return successResponse(res, "User deleted successfully.");
  } catch (err) {
    return errorResponse(res, "Failed to delete user.", err.message, 500);
  }
};