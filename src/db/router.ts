import knex, { Knex } from 'knex'
import type { Application } from '@feathersjs/koa'

// Replace this later with GCP Secret Manager
async function resolveSecret(ref: string): Promise<string> {
  // ref example: "gcp:projects/.../secrets/acme-db-pass"
  // For now: allow "plain:" for local dev
  if (ref.startsWith('plain:')) return ref.replace('plain:', '')
  throw new Error(`Secret ref not supported yet: ${ref}`)
}

type IsolationLevel = 'shared' | 'dedicated_db'

type DbTarget =
  | null
  | {
      type: 'postgres'
      host: string
      port?: number
      database: string
      user: string
      passwordSecretRef: string
      ssl?: boolean
    }

export class DbRouter {
  private app: Application
  private cache = new Map<string, Knex>() // key: vendorId

  constructor(app: Application) {
    this.app = app
  }

  // Platform DB is always shared/global
  platformDb(): Knex {
    return this.app.get('platformDb')
  }

  // For business data tables (catalog/orders/payments)
  async tenantDbForVendor(vendorId: string): Promise<{ db: Knex; isolation: IsolationLevel }> {
    const platform = this.platformDb()
    const vendor = await platform('vendors')
      .select(['id', 'isolation_level', 'db_target'])
      .where({ id: vendorId })
      .first()

    if (!vendor) throw new Error(`Unknown vendor_id: ${vendorId}`)

    const isolation = (vendor.isolation_level as IsolationLevel) || 'shared'

    // L1: shared
    if (isolation === 'shared') {
      return { db: this.app.get('platformDb'), isolation }
    }

    // L3: dedicated DB
    const target = vendor.db_target as DbTarget
    if (!target || target.type !== 'postgres') {
      throw new Error(`Vendor ${vendorId} is dedicated_db but db_target is missing/invalid`)
    }

    // Cache per vendor
    if (this.cache.has(vendorId)) {
      return { db: this.cache.get(vendorId)!, isolation }
    }

    const password = await resolveSecret(target.passwordSecretRef)

    const db = knex({
      client: 'pg',
      connection: {
        host: target.host,
        port: target.port ?? 5432,
        database: target.database,
        user: target.user,
        password,
        ssl: target.ssl ? { rejectUnauthorized: false } : undefined
      },
      pool: { min: 0, max: 5 },
      searchPath: ['public']
    })

    // Lightweight health check
    await db.raw('select 1')

    this.cache.set(vendorId, db)
    return { db, isolation }
  }

  // optional: close tenant db (for offboarding)
  async destroyVendorDb(vendorId: string) {
    const db = this.cache.get(vendorId)
    if (db) {
      await db.destroy()
      this.cache.delete(vendorId)
    }
  }
}
