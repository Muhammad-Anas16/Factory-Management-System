import express from "express";
import {
  login,
  createUser,
  getUsers,
  getMyProfile,
  updatePermissions,
  removeUser,
} from "../controller/user.controller.js";
import {
  protect,
  isAdmin,
  checkPageAccess,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", protect, getMyProfile);

router.post("/", protect, isAdmin, checkPageAccess("users"), createUser);
router.get("/", protect, isAdmin, checkPageAccess("users"), getUsers);
router.put(
  "/:id/permissions",
  protect,
  isAdmin,
  checkPageAccess("users"),
  updatePermissions,
);
router.delete("/:id", protect, isAdmin, checkPageAccess("users"), removeUser);

export default router;
