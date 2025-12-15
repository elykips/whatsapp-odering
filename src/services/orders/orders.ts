import type { Application } from '@feathersjs/koa'
import { OrdersService } from './orders.class'
import { authenticateInternal } from '../../hooks/authenticateInternal'
import { enforceCapability } from '../../hooks/enforceCapability'
import { resolveTenantDb } from '../../hooks/resolveTenantDb'

export const orders = (app: Application) => {
  app.use('orders', new OrdersService({
    Model: app.get('platformDb'),
    name: 'orders',
    paginate: app.get('paginate')
  }), 
  { methods: ['create', 'patch', 'get'] })

  app.service('orders').hooks({
    before: {
      all: [
        authenticateInternal,
        resolveTenantDb,
        enforceCapability('commerce.orders')
      ]
    }
  })

}

