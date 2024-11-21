import * as schema from './schema'
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

config();

const connectionUrl = process.env.NEXT_DRIZZLE_DATABASE_URL;
if (!connectionUrl) {
    throw new Error('Database connection string is not defined. Please set DRIZZLE_DATABASE_URL in your environment variables.');
}
const sql = neon(connectionUrl);
export const db = drizzle(sql,{schema});