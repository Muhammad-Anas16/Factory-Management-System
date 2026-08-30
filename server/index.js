import 'dotenv/config';
import { createApp } from './src/app.js';
import env from './src/config/env.js';
import { initDatabase } from './src/config/database.js';
import { seedDefaults } from './src/config/seed.js';

initDatabase();
seedDefaults();

const app = createApp();
app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`[FMS] API running at http://127.0.0.1:${env.PORT}`);
});
