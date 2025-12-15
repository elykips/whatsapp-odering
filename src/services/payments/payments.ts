import { PaymentsService } from './payments.class'
import { authenticateInternal } from '../../hooks/authenticateInternal'
import { enforceCapability } from '../../hooks/enforceCapability'
import type { Application } from '@feathersjs/koa'
import { resolveTenantDb } from '../../hooks/resolveTenantDb'

export const payments = (app: Application) => {
  app.use(
    'payments',
    new PaymentsService({
      Model: app.get('opsDb'),
      name: 'payments',
      paginate: app.get('paginate')
    }),
    { methods: ['create', 'patch'] }
  )

  app.service('payments').hooks({
    before: {
      all: [
        authenticateInternal, 
        resolveTenantDb, 
        enforceCapability('payments.mpesa_stk')]
    }
  })
}
