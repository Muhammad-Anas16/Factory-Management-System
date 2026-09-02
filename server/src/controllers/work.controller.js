import * as s from "../services/work.service.js";
import { asyncHandler } from "../utils/error.js";
import { ok } from "../utils/api.js";
import { audit } from "../utils/audit.js";

export const list = asyncHandler(async (req, res) => {
  const canViewAll =
    req.user.roleName === "admin" ||
    req.user.permissions["work-allocation"]?.can_view;
  ok(res, { items: s.list(req.user, canViewAll) });
});
export const create = asyncHandler(async (req, res) => {
  const id = s.create(req.body, req.user.id);
  audit(req, "create", "work_allocation", id);
  ok(res, { id }, "Work allocated", 201);
});
export const update = asyncHandler(async (req, res) => {
  s.update(req.params.id, req.body);
  audit(req, "update", "work_allocation", Number(req.params.id));
  ok(res, {}, "Allocation updated");
});
export const complete = asyncHandler(async (req, res) => {
  s.complete(
    req.params.id,
    req.body.completed_quantity,
    req.body.completion_date,
  );
  audit(req, "complete", "work_allocation", Number(req.params.id));
  ok(res, {}, "Work marked completed");
});
export const remove = asyncHandler(async (req, res) => {
  s.remove(req.params.id);
  audit(req, "delete", "work_allocation", Number(req.params.id));
  ok(res, {}, "Allocation deleted");
});
