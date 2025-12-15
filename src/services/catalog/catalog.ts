import { CatalogService } from './catalog.class'
import { authenticateInternal } from '../../hooks/authenticateInternal'
import { enforceCapability } from '../../hooks/enforceCapability'
import type { Application } from '@feathersjs/koa'
import { resolveTenantDb } from '../../hooks/resolveTenantDb'

export const catalog = (app: Application) => {
  app.use(
    'catalog',
    new CatalogService({
      Model: app.get('platformDb'),
      name: 'catalog_items',
      paginate: app.get('paginate')
    }),
    { methods: ['find'] }
  )

  app.service('catalog').hooks({
    before: {
      all: [
        authenticateInternal, 
        resolveTenantDb,
        enforceCapability('commerce.catalog')
      ]
    }
  })
}
