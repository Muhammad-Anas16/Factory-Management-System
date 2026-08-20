import 'dotenv/config';

const env = {
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_PATH: process.env.DATABASE_PATH || '../database/database.db',
    SEED_ADMIN_USERNAME: process.env.SEED_ADMIN_USERNAME || 'admin',
    SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
    SEED_ADMIN_ROLE: process.env.SEED_ADMIN_ROLE || 'admin',
};

if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing in .env');
}

export default env;