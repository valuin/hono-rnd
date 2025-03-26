import { Hono } from "hono";
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const getDb = (env: any) => {
  const connectionString = env.DATABASE_URL;
  
  const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? true : false
  });
  
  return drizzle(pool, { schema });
};

export { schema };