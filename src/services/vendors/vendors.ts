import type { Application } from '@feathersjs/koa'
import { VendorsService } from './vendors.class'

export const vendors = (app: Application) => {
  const platformDb = app.get('platformDb')

  if (!platformDb) {
    throw new Error('platformDb is not configured')
  }

  // platformDb.raw('select * from vendors limit 1')
  // .then(() => console.log('✅ Vendors service using PLATFORM DB'))
  // .catch((err: any) => {
  //   console.error('❌ Vendors service DB mismatch', err)
  //   process.exit(1)
  // })

  app.get('platformDb').raw('select current_database(), current_schema()')
  .then((r:any) => console.log('Vendors DB:', r.rows))


  app.use(
    'vendors',
    new VendorsService({
      Model: platformDb,      // ✅ EXPLICIT
      name: 'vendors',
      paginate: app.get('paginate')
    })
  )
}
