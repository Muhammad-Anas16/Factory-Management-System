import { errorResponse, successResponse } from "../helper/response.helper.js";
import { generateToken } from "../helper/token.helper.js";
import { findUserByUsername, registerUser } from "../model/user/user.model.js";

export const login = (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return errorResponse(
        res,
        "Username and password are required.",
        null,
        400,
      );
    }

    const user = findUserByUsername(username);
    if (!user)
      return errorResponse(res, "Invalid username or password.", null, 401);
    if (user.status !== "active")
      return errorResponse(
        res,
        "Account is disabled. Contact admin.",
        null,
        403,
      );

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return errorResponse(res, "Invalid username or password.", null, 401);

    const token = generateToken({ id: user.id, role: user.role });

    const { password: pwd, ...safeUser } = user;
    safeUser.allowedPages = JSON.parse(safeUser.allowedPages || "[]");

    return successResponse(res, "Login successful.", { token, user: safeUser });
  } catch (err) {
    return errorResponse(res, "Login failed.", err.message, 500);
  }
};

export const createUser = (req, res) => {
  try {
    const {
      name,
      username,
      password,
      role,
      allowedPages,
      canAdd,
      canEdit,
      canDelete,
    } = req.body;

    if (!name || !username || !password) {
      return errorResponse(
        res,
        "Name, username and password are required.",
        null,
        400,
      );
    }
    if (findUserByUsername(username)) {
      return errorResponse(res, "Username already taken.", null, 409);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUserId = registerUser({
      name,
      username,
      password: hashedPassword,
      role: role || "user", // admin apni marzi ka role de sakta hai
      allowedPages: JSON.stringify(allowedPages || []),
      canAdd: canAdd ? 1 : 0,
      canEdit: canEdit ? 1 : 0,
      canDelete: canDelete ? 1 : 0,
    });

    return successResponse(
      res,
      "User created successfully.",
      { id: newUserId },
      201,
    );
  } catch (err) {
    return errorResponse(res, "Failed to create user.", err.message, 500);
  }
};

export const getUsers = (req, res) => {
  try {
    const users = getAllUsers().map((u) => ({
      ...u,
      allowedPages: JSON.parse(u.allowedPages || "[]"),
    }));
    return successResponse(res, "Users fetched successfully.", users);
  } catch (err) {
    return errorResponse(res, "Failed to fetch users.", err.message, 500);
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

export const updatePermissions = (req, res) => {
  try {
    const { id } = req.params;
    const { role, allowedPages, canAdd, canEdit, canDelete } = req.body;

    const user = findUserById(id);
    if (!user) return errorResponse(res, "User not found.", null, 404);

    updateUserPermissions(id, {
      role: role || user.role,
      allowedPages: JSON.stringify(
        allowedPages ?? JSON.parse(user.allowedPages || "[]"),
      ),
      canAdd: canAdd !== undefined ? (canAdd ? 1 : 0) : user.canAdd,
      canEdit: canEdit !== undefined ? (canEdit ? 1 : 0) : user.canEdit,
      canDelete: canDelete !== undefined ? (canDelete ? 1 : 0) : user.canDelete,
    });

    return successResponse(res, "User permissions updated successfully.");
  } catch (err) {
    return errorResponse(
      res,
      "Failed to update permissions.",
      err.message,
      500,
    );
  }
};

export const removeUser = (req, res) => {
  try {
    const { id } = req.params;
    const user = findUserById(id);
    if (!user) return errorResponse(res, "User not found.", null, 404);
    if (user.role === "admin")
      return errorResponse(res, "Default admin cannot be deleted.", null, 403);

    deleteUserById(id);
    return successResponse(res, "User deleted successfully.");
  } catch (err) {
    return errorResponse(res, "Failed to delete user.", err.message, 500);
  }
};
