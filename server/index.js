import env from './src/config/env.config.js';
import db from './src/config/db.js';
import { runMigrations } from './src/db/migrate.js';
import { seedAdmin } from './src/db/seed.js';
import app from './src/app.js';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';

runMigrations(db);
seedAdmin();

// 

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(`[SERVER] Running at http://127.0.0.1:${env.PORT}`);
});