import express from "express";
import {
  login,
  createUser,
  getUsers,
  getSingleUser,
  getMyProfile,
  editUser,
  changeMyPassword,
  resetUserPassword,
  removeUser,
} from "../../controller/user/user.controller.js";
import {
  protect,
  isAdmin,
  checkPageAccess,
} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);

router.get("/me", protect, getMyProfile);
router.put("/me/password", protect, changeMyPassword);

router.post("/", protect, isAdmin, checkPageAccess("users"), createUser);
router.get("/", protect, isAdmin, checkPageAccess("users"), getUsers);
router.get("/:id", protect, isAdmin, checkPageAccess("users"), getSingleUser);
router.put("/:id", protect, isAdmin, checkPageAccess("users"), editUser);
router.put(
  "/:id/password",
  protect,
  isAdmin,
  checkPageAccess("users"),
  resetUserPassword,
);
router.delete("/:id", protect, isAdmin, checkPageAccess("users"), removeUser);

export default router;