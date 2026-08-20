import bcrypt from 'bcryptjs';
import env from './env.config.js';
import userModel from '../models/user.model.js';
import permissionModel from '../models/permission.model.js';

export function seedAdmin() {
    const existing = userModel.findByName(env.SEED_ADMIN_USERNAME);
    if (existing) {
        console.log('[SEED] Admin already exists, skipping');
        return;
    }

    if (!env.SEED_ADMIN_PASSWORD) {
        console.warn('[SEED] SEED_ADMIN_PASSWORD not set, skipping admin seed');
        return;
    }

    const passwordHash = bcrypt.hashSync(env.SEED_ADMIN_PASSWORD, 10);
    const admin = userModel.create({
        name: env.SEED_ADMIN_USERNAME,
        passwordHash,
        role: env.SEED_ADMIN_ROLE,
    });

    permissionModel.grantAll(admin.id);

    console.log(`[SEED] Admin user "${admin.name}" created with full permissions`);
}