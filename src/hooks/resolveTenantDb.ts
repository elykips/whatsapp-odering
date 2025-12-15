import type { HookContext } from '@feathersjs/feathers'

function resolveVendorId(context: HookContext): string | undefined {
  const { params, data } = context
  return (
    params?.vendor_id ||
    params?.query?.vendor_id ||
    data?.vendor_id ||
    params?.headers?.['x-vendor-id']
  )
}

/**
 * For services that store tenant-owned business data.
 * It sets params.adapter.Model per request so Feathers Knex uses the right DB.
 */
export const resolveTenantDb = async (context: HookContext) => {
  const vendorId = resolveVendorId(context)
  if (!vendorId) {
    throw new Error('vendor_id is required (query, data, or x-vendor-id)')
  }

  const router = context.app.get('dbRouter')
  const { db, isolation } = await router.tenantDbForVendor(vendorId)

  // 👇 Key trick: per-request adapter override
  context.params = context.params || {}
  context.params.adapter = {
    ...(context.params.adapter || {}),
    Model: db
  }

  // Make available downstream
  context.params.vendor_id = vendorId
  context.params.isolation_level = isolation

  return context
}
