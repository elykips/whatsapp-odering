import { platformDb } from './platformDb';

export async function getVendorCapabilities(vendorId: string) {
  const res = await platformDb.query(
    `SELECT vc.capability_key, vc.config, c.dependencies
     FROM vendor_capabilities vc
     JOIN capabilities c ON vc.capability_key = c.capability_key
     WHERE vc.vendor_id = $1 AND vc.enabled = true`,
    [vendorId]
  );

  const map: Record<string, any> = {};
  for (const row of res.rows) {
    map[row.capability_key] = {
      config: row.config,
      dependencies: row.dependencies
    };
  }
  return map;
}
