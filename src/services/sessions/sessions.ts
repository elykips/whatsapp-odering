import { SessionsService } from './sessions.class'
import { authenticateInternal } from '../../hooks/authenticateInternal'
import type { Application } from '@feathersjs/koa'

export const sessions = (app: Application) => {
  app.use(
    'sessions',
    new SessionsService({
      Model: app.get('opsDb'),
      name: 'sessions',
      paginate: app.get('paginate')
    }),
    { methods: ['create', 'patch', 'get'] }
  )

  app.service('sessions').hooks({
    before: {
      all: [authenticateInternal]
    }
  })
}
