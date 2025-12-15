import { Application } from '@feathersjs/koa'
import { PaymentsService } from './payments.class'
import { authenticateInternal } from '../../hooks/authenticateInternal'
import { resolveTenantDb } from '../../hooks/resolveTenantDb'
import { enforceCapability } from '../../hooks/enforceCapability'

export const payments = (app: Application) => {
  app.use('payments', new PaymentsService({
    Model: app.get('platformDb'),
    name: 'payments',
    paginate: app.get('paginate')
  }))

  app.service('payments').hooks({
    before: {
      all: [
        authenticateInternal,
        resolveTenantDb,
        enforceCapability('payments.core')
      ]
    }
  })
}
