import { defineConfig } from '@mikro-orm/postgresql';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { schema } from './db/RequestLog.js';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('[DEBUG] DATABASE_URL:', process.env.DATABASE_URL);

export default defineConfig({
  entities: [schema],
  clientUrl: process.env.DATABASE_URL,
  driverOptions: {
    connection: {
      ssl: { rejectUnauthorized: false }, 
    },
  },
  debug: true,
});
