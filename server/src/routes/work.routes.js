import { Router } from "express";
import {
  list,
  create,
  update,
  complete,
  remove,
} from "../controllers/work.controller.js";
import { requireAuth, requirePermission } from "../middleware/auth.js";
import { ApiError } from "../utils/error.js";

const r = Router();
r.use(requireAuth);

// Karigars/helpers ko by default sirf 'work-completion' milti hai (unhe apna
// assigned kaam dekhna hai taake complete mark kar sakein), jabke
// supervisors/admin ko 'work-allocation'. List route dono ko allow karna
// chahiye — controller khud decide karta hai ke SAB dikhana hai ya sirf apna.
function canViewWork(req, _res, next) {
  if (req.user.roleName === "admin") return next();
  const perms = req.user.permissions;
  if (perms["work-allocation"]?.can_view || perms["work-completion"]?.can_view)
    return next();
  next(new ApiError(403, "Permission denied: view on work-allocation"));
}

r.get("/", canViewWork, list);
r.post("/", requirePermission("work-allocation", "create"), create);
r.put("/:id", requirePermission("work-allocation", "edit"), update);
r.post("/:id/complete", requirePermission("work-completion", "edit"), complete);
r.delete("/:id", requirePermission("work-allocation", "delete"), remove);
export default r;
