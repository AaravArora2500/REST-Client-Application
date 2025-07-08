import { defineConfig } from '@mikro-orm/postgresql';
import dotenv from 'dotenv';
import { schema } from './RequestLog.js';

dotenv.config();

export default defineConfig({
  entities: [schema],
  clientUrl: process.env.DATABASE_URL,
  debug: process.env.NODE_ENV !== 'production',
});
