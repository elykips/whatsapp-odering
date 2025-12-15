import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import {
  koa,
  rest,
  bodyParser,
  errorHandler,
  cors,
  type Application
} from '@feathersjs/koa'
import { DbRouter } from './db/router'

import { configurationValidator } from './configuration'
import { logError } from './hooks/log-error'
import { postgresql } from './postgresql'
import { services } from './services'

import type { ServiceTypes } from './declarations'

const app: Application<ServiceTypes> = koa(feathers())

// ─────────────────────────────
// Configuration
// ─────────────────────────────
app.configure(configuration(configurationValidator))

// ─────────────────────────────
// Middleware
// ─────────────────────────────
app.use(cors())
app.use(errorHandler())
app.use(bodyParser())

// ─────────────────────────────
// REST transport
// ─────────────────────────────
app.configure(rest())

// ─────────────────────────────
// Database
// ─────────────────────────────
app.configure(postgresql)
app.set('dbRouter', new DbRouter(app))


app.use(async (ctx, next) => {
  if (ctx.path === '/debug/db') {
    const vendorId = ctx.query.vendor_id as string

    if (!vendorId) {
      ctx.status = 400
      ctx.body = { error: 'vendor_id is required' }
      return
    }

    const router = app.get('dbRouter')
    const { db, isolation } = await router.tenantDbForVendor(vendorId)

    const result = await db.raw(
      'select current_database() as db, current_schema() as schema'
    )

    ctx.body = {
      vendor_id: vendorId,
      isolation,
      ...result.rows[0]
    }
    return
  }

  await next()
})


const platformDb = app.get('platformDb')
const opsDb = app.get('opsDb')

Promise.all([
  platformDb.raw('select 1'),
  opsDb.raw('select 1')
])
  .then(() => {
    console.log('✅ Platform DB connected')
    console.log('✅ Ops DB connected')
  })
  .catch((err: any) => {
    console.error('❌ Database connection failed', err)
    process.exit(1)
  })

// ─────────────────────────────
// Services (ONLY HERE)
// ─────────────────────────────
app.configure(services)

app.use(async (ctx, next) => {
  if (ctx.path === '/debug/db') {
    const vendorId = ctx.query.vendor_id as string
    if (!vendorId) {
      ctx.status = 400
      ctx.body = { error: 'vendor_id is required' }
      return
    }

    const router = app.get('dbRouter')
    const { db, isolation } = await router.tenantDbForVendor(vendorId)

    const result = await db.raw(
      'select current_database() as db, current_schema() as schema'
    )

    ctx.body = {
      vendor_id: vendorId,
      isolation,
      ...result.rows[0]
    }
    return
  }

  await next()
})


// ─────────────────────────────
// Global hooks
// ─────────────────────────────
app.hooks({
  around: {
    all: [logError]
  }
})

// ─────────────────────────────
// Health check
// ─────────────────────────────
app.use(async (ctx, next) => {
  if (ctx.path === '/health') {
    ctx.body = { status: 'ok' }
    return
  }
  await next()
})

export { app }
