import { errorResponse } from "../helper/response.helper.js";
import { verifyToken } from "../helper/token.helper.js";
import { findUserById } from "../model/user/user.model.js";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return errorResponse(res, "No token provided. Access denied.", null, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    const user = findUserById(decoded);

    if (!user) {
      return errorResponse(res, "User No Longer Exist", null, 401);
    }

    if (!user.status !== "active") {
      return errorResponse(res, "Account is Disable", null, 403);
    }

    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (error) {
    return errorResponse(
      req,
      "Invalid or Token is Expired",
      error.message,
      401,
    );
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return errorResponse(res, "Only admin can perform this action.", null, 403);
  }
  next();
};

export const checkPageAccess = (pageName) => (req, res, next) => {
  if (req.user.role === "admin") return next();

  const allowedPages = JSON.parse(req.user.allowedPages || "[]");

  if (!allowedPages.includes(pageName)) {
    return errorResponse(
      res,
      `Access denied. You are not allowed to access '${pageName}'.`,
      null,
      403,
    );
  }
  next();
};

// 4/5/6. Add / Edit / Delete authority check
export const checkCanAdd = (req, res, next) => {
  if (req.user.role === "admin") return next();
  if (!req.user.canAdd)
    return errorResponse(res, "You do not have permission to add.", null, 403);
  next();
};

export const checkCanEdit = (req, res, next) => {
  if (req.user.role === "admin") return next();
  if (!req.user.canEdit)
    return errorResponse(res, "You do not have permission to edit.", null, 403);
  next();
};

export const checkCanDelete = (req, res, next) => {
  if (req.user.role === "admin") return next();
  if (!req.user.canDelete)
    return errorResponse(
      res,
      "You do not have permission to delete.",
      null,
      403,
    );
  next();
};
