import 'dotenv/config'
import type { Knex } from 'knex'

const config: { [key: string]: Knex.Config } = {
  platform: {
    client: 'pg',
    connection: process.env.PLATFORM_DB_URL,
    migrations: {
      directory: './migrations/platform'
    },
    seeds: {
    directory: './seeds/platform'
  }
  },
  ops: {
    client: 'pg',
    connection: process.env.OPS_DB_URL,
    migrations: {
      directory: './migrations/ops'
    }
  },
  tenant: {
    client: 'pg',
    connection: process.env.TENANT_DB_URL,
    migrations: {
      directory: './migrations/tenants'
    }
  }
}

export default config

