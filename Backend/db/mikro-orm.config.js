import { defineConfig } from '@mikro-orm/postgresql';
import dotenv from 'dotenv';
import { schema } from './RequestLog.js';

dotenv.config();

export default defineConfig({
  entities: [schema],
  dbName: process.env.DB_NAME,
  driverOptions: {},
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  debug: true,
});
