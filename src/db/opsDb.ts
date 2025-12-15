import { Pool } from 'pg';

export const opsDb = new Pool({
  host: process.env.OPS_DB_HOST,
  database: process.env.OPS_DB_NAME,
  user: process.env.OPS_DB_USER,
  password: process.env.OPS_DB_PASSWORD
});
