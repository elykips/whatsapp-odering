import { Pool } from 'pg';

export const platformDb = new Pool({
  host: process.env.PLATFORM_DB_HOST,
  database: process.env.PLATFORM_DB_NAME,
  user: process.env.PLATFORM_DB_USER,
  password: process.env.PLATFORM_DB_PASSWORD
});

export async function getVendor(vendorId: string) {
  const res = await platformDb.query(
    `SELECT vendor_id, status, data_mode
     FROM vendors
     WHERE vendor_id = $1`,
    [vendorId]
  );
  return res.rows[0];
}
