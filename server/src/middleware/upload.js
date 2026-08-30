import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import env from '../config/env.js';

fs.mkdirSync(path.join(env.UPLOAD_DIR, 'articles'), { recursive: true });
fs.mkdirSync(path.join(env.UPLOAD_DIR, 'users'), { recursive: true });

function storageFor(folder) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(env.UPLOAD_DIR, folder)),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
    },
  });
}

const imageFilter = (_req, file, cb) => {
  if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
  else cb(new Error('Only image files are allowed'));
};

export const uploadArticleImages = multer({ storage: storageFor('articles'), fileFilter: imageFilter, limits: { files: 10, fileSize: 5 * 1024 * 1024 } });
export const uploadUserImage = multer({ storage: storageFor('users'), fileFilter: imageFilter, limits: { fileSize: 3 * 1024 * 1024 } });
