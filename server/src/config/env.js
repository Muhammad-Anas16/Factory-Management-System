import path from 'node:path';

const root = process.cwd();
const env = {
  PORT: Number(process.env.PORT || 4000),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  DATABASE_PATH: path.resolve(root, process.env.DATABASE_PATH || './storage/factory.sqlite'),
  JWT_SECRET: process.env.JWT_SECRET || 'dev-only-secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  SEED_ADMIN_USERNAME: process.env.SEED_ADMIN_USERNAME || 'admin',
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD || 'admin123',
  UPLOAD_DIR: path.resolve(root, process.env.UPLOAD_DIR || './storage/uploads'),
};

if (env.JWT_SECRET.length < 16) console.warn('[FMS] Warning: JWT_SECRET is short; use a stronger secret in production.');
export default env;
