import bcrypt from 'bcryptjs';
export const hashPassword = (password) => bcrypt.hashSync(password, 12);
export const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);
