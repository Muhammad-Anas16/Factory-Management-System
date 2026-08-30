import userModel from '../models/user.model.js';
import { comparePassword } from '../utils/password.js';
import { signToken } from '../utils/token.js';
import { ApiError } from '../utils/error.js';

export function login(username, password) {
  if (!username || !password) throw new ApiError(400, 'Username and password are required');
  const row = userModel.findByUsername(username);
  if (!row || !row.is_active || !comparePassword(password, row.password_hash)) throw new ApiError(401, 'Invalid username or password');
  const user = userModel.toAuthUser(row);
  return { token: signToken({ id: user.id }), user };
}
