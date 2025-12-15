import 'dotenv/config'
import knex from 'knex'
import type { Application } from '@feathersjs/koa'

export const postgresql = (app: Application) => {
  const platformConfig = app.get('platformDbConfig')
  const opsConfig = app.get('opsDbConfig')

  const {PLATFORM_DB_URL,  OPS_DB_URL } = process.env

   if (!PLATFORM_DB_URL || !OPS_DB_URL) {
    throw new Error('Missing PLATFORM_DB_URL or OPS_DB_URL')
  }

  if (!platformConfig || !opsConfig) {
    throw new Error('Database configs missing')
  }

  // 🔥 FORCE search_path=public
  const platformDb = knex({
    ...platformConfig,
    connection: process.env.PLATFORM_DB_URL,
    searchPath: ['public']
  })

  const opsDb = knex({
    ...opsConfig,
    connection: process.env.OPS_DB_URL,
    searchPath: ['public']
  })

  // 🔥 STORE KNEX CLIENTS UNDER DIFFERENT KEYS
  app.set('platformDb', platformDb)
  app.set('opsDb', opsDb)

  console.log('Platform DB URL:', platformConfig.connection)

}
