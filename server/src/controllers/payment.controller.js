import * as s from '../services/payment.service.js';
import { asyncHandler } from '../utils/error.js';
import { ok } from '../utils/api.js';
import { audit } from '../utils/audit.js';

export const list = asyncHandler(async (_req, res) => ok(res, { items: s.list() }));
export const create = asyncHandler(async (req, res) => {
  const id = s.create(req.body, req.user.id);
  audit(req, 'create', 'payment', id);
  ok(res, { id }, 'Payment recorded', 201);
});
