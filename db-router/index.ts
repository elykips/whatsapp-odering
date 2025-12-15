import 'dotenv/config'
import http from 'http'
import knex from 'knex'

const platformDb = knex({
  client: 'pg',
  connection: process.env.PLATFORM_DB_URL,
  pool: { min: 1, max: 5 }
})

const opsDb = knex({
  client: 'pg',
  connection: process.env.OPS_DB_URL,
  pool: { min: 1, max: 5 }
})

async function start() {
  try {
    await platformDb.raw('select 1')
    console.log('✅ DB Router: platform DB ready')

    await opsDb.raw('select 1')
    console.log('✅ DB Router: ops DB ready')

    const server = http.createServer((req, res) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      res.end('DB Router running') // ✅ STRING ONLY
    })

    server.listen(3001, () => {
      console.log('🚀 DB Router running on http://localhost:3001')
    })
  } catch (error) {
    console.error('❌ DB Router startup failed', error)
    process.exit(1)
  }
}

start()
